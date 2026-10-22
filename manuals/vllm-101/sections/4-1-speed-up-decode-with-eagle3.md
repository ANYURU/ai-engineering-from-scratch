# Speed up decode with EAGLE3

> EAGLE3 pays at low concurrency, and the draft depth that pays falls as more users share each step.

Your users wait for long answers at low load. When you finish this section, you can choose the draft depth for your concurrency.

**Our result:** on our clock-locked L4, EAGLE3 at depth 3 gave 1.6 times the output of no speculation at 32 users.

## Turn it on

EAGLE3 adds a small draft model that guesses the next tokens from the hidden states of the target model. The target model checks the guesses in one pass, as [the speculative decoding page](#s-how-speculative-decoding-checks-drafts) explains. The target model keeps only the guesses it would have written itself.

You need a draft that someone trained for your target model. For `Qwen/Qwen3-8B`, we used `Tengyunw/qwen3_8b_eagle3`:

```bash
vllm serve Qwen/Qwen3-8B \
  --speculative-config '{"method": "eagle3", "model": "Tengyunw/qwen3_8b_eagle3", "num_speculative_tokens": 3}'
```

`num_speculative_tokens` is the draft depth: the number of tokens the draft guesses in each step. If you leave it out, vLLM takes the value from the draft config, if the config has one. Set it yourself, so you know what runs.

EAGLE3 keeps async scheduling on. [The async scheduling page](#s-leave-async-scheduling-on) lists the methods that turn it off.

## Know why the depth matters

A deeper draft can give more tokens for each pass of the target model. But each guess also costs work in the check. With one user, the GPU has spare compute in each step, so the extra guesses are almost free. With many users, each step is already full, and wrong guesses take compute from real tokens.

## See what our runs show

**We measured** EAGLE3 at depths 1, 3, and 5 against no speculation on our L4 with `Qwen/Qwen3-8B` on 2026-10-22. We locked the SM clock at 900 MHz with `nvidia-smi -lgc`, and ran 1 and 32 users with two seeds each.

```figure
id: fig-4-1
kind: chart
title: EAGLE3 output by draft depth
claim: With the clock locked, a draft depth of 3 gave the highest output at 32 users, and depths 3 and 5 tied at one user.
caption: Each bar is the median of two seeds. The run with no speculation at one user is left out, because its clock fell to 210 MHz. From capture/gpu/summary/l4.json.
```

| Users | Config | Median TPOT | Output tok/s | Median SM clock |
|---|---|---|---|---|
| 32 | no speculation | 119.9 ms | 208.8 | 881 MHz |
| 32 | depth 1 | 100.4 ms | 271.1 | 900 MHz |
| 32 | depth 3 | 77.8 ms | 333.6 | 900 MHz |
| 32 | depth 5 | 83.7 ms | 289.5 | 885 MHz |
| 1 | depth 1 | 39.4 ms | 22.4 | 900 MHz |
| 1 | depth 3 | 27.8 ms | 31.3 | 900 MHz |
| 1 | depth 5 | 26.2 ms | 31.7 | 900 MHz |

At 32 users, depth 3 gave 1.6 times the output of no speculation. Its seed range did not overlap with any other config. Depth 5 gave less output than depth 3, so the extra guesses cost more than they gave.

At one user, depth 3 cut the time per token from 39.4 to 27.8 ms against depth 1. Depth 5 gave about the same as depth 3, and their seed ranges overlapped.

The run with no speculation at one user fell to 210 MHz, below the lock. A lock sets the highest clock, and it cannot stop the GPU from slowing down when it is hot. So we do not compare EAGLE3 against no speculation at one user.

We did not collect acceptance data from these runs, so we give no acceptance length here.

## Lock the clock before you compare

Our first EAGLE3 runs had no clock lock. At one user, the run with no speculation ran at 210 MHz, and the EAGLE3 run at about 1,400 MHz. A gap that large hides the effect of speculation, so we set those runs aside.

Before you compare speculative decoding with no speculation, lock the clock or record it for each run. Compare two runs only at the same clock.

## Choose the depth

- Start with a depth of 3. It gave the best output at 32 users and tied for the best at one user.
- Do not go deeper for a busy server. Depth 5 lost output at 32 users.
- If your load changes a lot through the day, vLLM can set the depth by batch size with `num_speculative_tokens_per_batch_size`. We did not test it.

## Check the gain on your prompts

Our prompts came from the random dataset of the benchmark tool. Real prompts give a different acceptance rate. Run your own load with and without the config, and read the two counters from `/metrics`:

```bash
curl -s http://localhost:8000/metrics | grep -E "spec_decode_num_(draft|accepted)_tokens"
```

Divide the accepted tokens by the draft tokens. vLLM also writes a `SpecDecoding metrics` line to the log, with the mean acceptance length.

```takeaways
- Use a draft trained for your target model, and set the depth yourself.
- Start with a depth of 3. On our L4 it gave 1.6 times the output at 32 users.
- A depth of 5 added nothing at one user and lost output at 32 users.
- Lock or record the GPU clock before you compare speculative decoding.
```

Sources: capture/gpu/summary/l4.json (load.vllm-lock-b, load.vllm-lock-eagle3-k1, load.vllm-lock-eagle3-k3, load.vllm-lock-eagle3-k5), the vLLM source at v0.31.0 (vllm/config/speculative.py, vllm/v1/spec_decode/metrics.py), vLLM documentation at v0.31.0 (docs/features/speculative_decoding/eagle.md, docs/features/speculative_decoding/dynamic_speculative_decoding.md).
