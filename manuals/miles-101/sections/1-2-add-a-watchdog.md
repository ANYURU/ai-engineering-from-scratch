# Add a watchdog before you leave a run alone

> When the rollout engine dies, a Miles run does not fail, so a small script must stop it for you.

We left a run alone for an hour. When we came back, the GPU was idle and the log had grown to 147 MB. The rollout engine had died during startup, and the run had sent requests to it ever since.

When you finish this section, you can recognize a run whose engine died. You can also start a watchdog that stops that run within a minute.

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

## Why one count is enough

In our 14 runs that finished, the log held no `503 Service Unavailable` line at all. In the failed run, every minute held at least 1,838 of them. A limit of 100 errors in 60 seconds is far from both, so the watchdog does not stop a healthy run.

## Start the watchdog

The script reads the last 60 seconds of the container log every 30 seconds. It stops the container when the count passes the limit:

```bash
#!/bin/sh
name=${1:-miles-plain}
limit=${2:-100}
while docker ps -q --filter "name=^${name}$" | grep -q .; do
  errors=$(docker logs --since 60s "$name" 2>&1 | grep -c "503 Service Unavailable")
  if [ "$errors" -gt "$limit" ]; then
    echo "$(date -u +%FT%TZ) $name: $errors errors from the rollout engine in 60 s, stopping the run"
    docker stop "$name"
    exit 1
  fi
  sleep 30
done
echo "$(date -u +%FT%TZ) $name: the run ended"
```

Save it as `~/miles-lab/watchdog.sh`. Start it in a second terminal right after the run starts, with the container name from [section 1.1](#s-run-grpo-on-one-gpu):

```bash
sh ~/miles-lab/watchdog.sh miles-plain 100
```

## Test the watchdog first

Test it on a container that prints the error on purpose. It needs no GPU:

```listing
title: the watchdog stops a container that prints the error
source: capture/gpu/out-gb10/watchdog-test.txt
lang: text
note: The test container prints ten error lines each second.
---
$ sh capture/gpu/watchdog.sh wd-test 100
2026-10-22T07:03:16Z wd-test: 149 errors from the rollout engine in 60 s, stopping the run
wd-test
$ echo $?
1
```

The watchdog found 149 errors on its first check, stopped the container, and exited with 1. A script that starts runs one after another can read that exit code and skip to the next run.

The watchdog only stops the run. To find out why the engine died, read the engine lines above the first error. [Section 7.1](#s-troubleshoot-by-symptom) lists the causes we met.

```takeaways
- Start the watchdog in a second terminal for every run you leave alone.
- Test the watchdog on a fake container before you trust it.
- Read the engine lines above the first 503 error to find the cause.
```

Sources: capture/gpu/watchdog.sh; capture/gpu/out-gb10/engine-died-503.log; capture/gpu/out-gb10/engine-died-count.txt; capture/gpu/out-gb10/watchdog-test.txt; capture/gpu/summary/miles-gb10-lab.json (excluded runs); Miles rollout client at main 08752a12.
