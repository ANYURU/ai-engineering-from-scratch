# Lab notes

> The machine, the image, the seeds, and the thermal rule behind every measured number in this manual.

This page is reference. It lists how each number in the manual was made, so you can repeat the run or judge the result.

## Machine and image

| Item | Value |
|---|---|
| Machine | NVIDIA DGX Spark, one GB10 GPU, 128 GB of unified memory |
| Memory that Ray reported | 121.69 GB |
| Image | `radixark/miles@sha256:c64fa344e3a86715f03c0a1b6a422c474e0035355591a2f6da87bf52a74c52da`, arm64 |
| Miles in the image | main `08752a1283`, 2026-10-15 |
| SGLang in the image | `0.5.22.dev46+g7b6993a` |
| Model | `Qwen/Qwen3-0.6B`, unless the run name gives another size |
| Data | GSM8K prompts with a binary math reward |

## Default run settings

Every run used these settings unless its name says otherwise:

| Setting | Value |
|---|---|
| Prompts per step | 32 (`--rollout-batch-size`) |
| Answers per prompt | 8 (`--n-samples-per-prompt`) |
| Samples per optimizer step | 256 (`--global-batch-size`) |
| Answer limit | 1,024 tokens |
| Temperature | 1 |
| Learning rate | 1e-6, constant |
| Trainer | FSDP on one GPU, colocated with the engine |
| Engine memory fraction | 0.4 |
| Weight update bucket | 536870912 bytes, 512 MiB |

## Runs

| Run | Steps | Seed | What changed |
|---|---|---|---|
| plain | 12 | default | none, before the heat guard |
| plain-48 | 48 | default | none |
| plain-48-s2, plain-48-s3 | 48 | 2, 3 | none |
| e6a-base | 12 | 1 | none |
| e6b, e6c, e6d | 12 | 1 | deterministic inference on Triton, FlashInfer, and Triton again |
| e11-topp-topk | 12 | 1 | top-p 0.95 and top-k 64 |
| e3b, e3c, e3d | 12 | 1 | offload only the KV cache, keep the engine loaded at memory fraction 0.25, keep the trainer loaded |
| e4-0.6b, e4-1.7b | 4 | 1 | answers cut at 256 tokens, model size |
| e2-n4 | 24 | 1 | 4 answers per prompt |

Three runs failed and are left out of every table: two true on-policy runs that stopped at start, and a Qwen3-4B run that Ray stopped.

## The heat guard

The GB10 runs hot under sustained load, so a script pauses the Miles container when the GPU reaches 84 C. It resumes the container when the GPU is at 74 C or below after at least 45 seconds, or after 120 seconds at most. On its first day the limits were 80 C and 68 C, and they changed to 84 C and 74 C that morning.

The pause log holds 712 pauses up to 2026-10-22.

## The timing rule

A pause adds wall-clock time to the phase it falls in. So every time in this manual comes from steps that no pause touched:

- **Rollout times:** the rollout window ends at the timestamp of the rollout metrics line and lasts `perf/rollout_time`. A step counts when that window overlaps no pause.
- **Whole-step times:** the window ends at the timestamp of the trainer metrics line and lasts `perf/step_time`. A step counts when that window overlaps no pause.

The summary file stores both medians, all steps and clean steps, with the number of clean steps next to each. Under the heat guard, few whole steps escape a pause. So whole-step times in this manual come from `plain` and `plain-48`, which no pause touched.

A step without a pause can still be slower on a hot card. The default setting gave a 47.5 s rollout in `plain-48` and 59.1 s in the clean steps of `e6a-base`. So compare times only within one session.

## Results that are leads

These numbers rest on one run and are labelled as leads where they appear:

- The rollout time with the engine kept loaded, in section 2.2. Three queued runs decide it.
- The cost of deterministic inference, in section 4.5.
- The effect of a higher Ray memory threshold, in section 2.3. One queued run decides it.

```takeaways
- Every time in this manual comes from steps that no heat-guard pause touched.
- Compare times only within one session, because a hot card can run slower without a pause.
- Treat the results listed as leads as directions, not sizes.
```

Sources: capture/gpu/heat-guard.sh; capture/gpu/out-gb10/image-identity.txt; capture/gpu/miles_grpo.py; capture/gpu/summarize_miles.py; capture/gpu/summary/miles-gb10-lab.json; capture/gpu/out-gb10/thermostat.log; capture/gpu/out-gb10/unpaused-timing.txt; capture/gpu/out-gb10/ray-oom-4b.log.
