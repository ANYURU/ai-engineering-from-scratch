# Add a watchdog before you leave a run alone

> When the rollout engine dies, a Miles run does not fail, so a small script must stop it for you.

We left a run alone for an hour. When we came back, the GPU was idle and the log had grown to 147 MB. The rollout engine had died during startup, and the run had sent requests to it ever since.

When you finish this section, you can recognize a run whose engine died. You can also start a watchdog that stops that run within a few minutes.

**Our result:** a run whose engine died logged 200,533 HTTP 503 errors in 63 minutes and never failed. The watchdog stopped a test of the same error in 183 s. It let a test with one-minute bursts of the error run to its end.

## What a dead engine looks like

The run below used a setting that this GPU cannot run. The rollout engine stopped during startup. The trainer did not stop, and it sent requests to the engine for 63 minutes:

```listing
title: an engine that died, and a run that did not notice
source: capture/gpu/out-gb10/engine-died-503.log
lang: text
note: The first three lines are the engine failure. The last two are the first and the last error from the trainer side, 63 minutes apart.
---
[2026-10-17 21:03:03] Enable deterministic inference because of legacy rl_on_policy_target.
AssertionError: FlashAttention v3 Backend requires SM>=80 and SM<=90. Please use `--attention-backend flashinfer`.
[2026-10-17 21:03:24] Received sigquit from a child process. It usually means the child failed.
[2026-10-17 21:03:30.637 rollout_executor] http_utils.py:241 - Error: Server error '503 Service Unavailable' for url 'http://172.17.0.3:20035/generate'
[2026-10-17 22:06:46.137 rollout_executor] http_utils.py:241 - Error: Server error '503 Service Unavailable' for url 'http://172.17.0.3:20035/generate'
```

```listing
title: how many errors the run wrote
source: capture/gpu/out-gb10/engine-died-count.txt
lang: text
note: One grep over the full log of that run.
---
$ grep -c "503 Service Unavailable" true-on-policy-fa3.log
200533
```

The run wrote 200,533 error lines and never reported a failure. **503 Service Unavailable:** the HTTP status the router returns when no rollout engine can take the request.

```figure
id: fig-1-2
kind: timeline
title: A dead engine does not stop the job
claim: Without a watchdog, a dead engine left the job running for 63 minutes with an idle GPU.
caption: The top track is our failed run. The bottom track is the watchdog test on a container that writes the same error.
```

## Why the watchdog waits for six checks

In our 17 runs that ended normally, the log held no `503 Service Unavailable` line at all. Our 16-answer run of [section 3.1](#s-train-math-on-gsm8k) logged 22,357 of them. They came in bursts of up to 60 s, with up to 2,209 in one minute. The client retried each request, and the run finished all its steps.

In the failed run, the errors never stopped. Every minute held at least 1,838 of them, for 63 minutes.

A count alone cannot tell these two runs apart, but the time can. So the watchdog stops a run only when it finds more than 100 errors in six checks in a row. That is about three minutes of errors without a break, three times our longest healthy burst.

## Start the watchdog

The script reads the last 60 seconds of the container log every 30 seconds. It stops the container when the count passes the limit in six checks in a row:

```bash
#!/bin/sh
name=${1:-miles-plain}
limit=${2:-100}
checks=${3:-6}
strikes=0
while docker ps -q --filter "name=^${name}$" | grep -q .; do
  errors=$(docker logs --since 60s "$name" 2>&1 | grep -c "503 Service Unavailable")
  if [ "$errors" -gt "$limit" ]; then
    strikes=$((strikes + 1))
  else
    strikes=0
  fi
  if [ "$strikes" -ge "$checks" ]; then
    echo "$(date -u +%FT%TZ) $name: more than $limit errors from the rollout engine in each of $checks checks, last $errors in 60 s, stopping the run"
    docker stop "$name"
    exit 1
  fi
  sleep 30
done
echo "$(date -u +%FT%TZ) $name: the run ended"
```

Save it as `~/miles-lab/watchdog.sh`. Start it in a second terminal right after the run starts, with the container name from [section 1.1](#s-run-grpo-on-one-gpu):

```bash
sh ~/miles-lab/watchdog.sh miles-plain 100 6
```

## Test the watchdog first

Test it on two containers that print the error on purpose. They need no GPU. The first prints ten error lines each second and never stops, like a dead engine:

```listing
title: the watchdog stops a container that never stops printing the error
source: capture/gpu/out-gb10/watchdog-test.txt
lang: text
note: The container prints ten error lines each second.
---
$ sh capture/gpu/watchdog.sh wd-dead 100
2026-10-22T15:41:09Z wd-dead: more than 100 errors from the rollout engine in each of 6 checks, last 578 in 60 s, stopping the run
wd-dead
$ echo $?
1
```

The watchdog stopped the container 183 s after it started, and exited with 1. A script that starts runs one after another can read that exit code and skip to the next run.

The second container prints the error for 60 s and then stays quiet for two minutes. It does this three times, like the bursts of a busy engine. The watchdog let it run to its end after 541 s, and exited with 0.

The watchdog only stops the run. To find out why the engine died, read the engine lines above the first error. [Section 7.1](#s-troubleshoot-by-symptom) lists the causes we met.

```takeaways
- Start the watchdog in a second terminal for every run you leave alone.
- Test the watchdog on a fake container before you trust it.
- Read the engine lines above the first 503 error to find the cause.
```

Sources: capture/gpu/watchdog.sh; capture/gpu/out-gb10/engine-died-503.log; capture/gpu/out-gb10/engine-died-count.txt; capture/gpu/out-gb10/watchdog-test.txt; capture/gpu/summary/miles-gb10-lab.json (excluded runs); Miles rollout client at main 08752a12.
