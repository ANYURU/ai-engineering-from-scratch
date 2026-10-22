# Roll out in FP8 and train in BF16

> FP8 rollout makes generation cheaper and makes the trainer and the engine disagree more, so it needs a correction.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can decide if FP8 rollout is worth the larger gap.

## What we know now

- We have not run FP8 rollout yet.
- MXFP8 and NVFP4 recipes need datacenter Blackwell GPUs, so the GB10 cannot run them.

```takeaways
- Measure the log probability gap before and after FP8 rollout.
- Add a correction method when the gap grows.
```

Sources: Miles low-precision documentation at main 08752a12.
