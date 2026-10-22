# Troubleshoot by symptom

> Start from what you see, and each entry gives the likely cause, the check, and the fix.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can find the cause of a failed or wrong run from its first symptom.

## What we know now

- Entries we met on the GB10: the engine died and the run kept going, Ray stopped the job, and FlashAttention 3 refused to start.
- Entries from the Miles issues: a flat reward, NaN loss after offload, a segfault in the weight update, and slow rollout at many open requests.

```takeaways
- Start from the first symptom in the log.
- Read the engine lines before the trainer lines.
```

Sources: capture/gpu/out-gb10/engine-died-503.log; Miles issues 4003, 4019, 4134, 4238.
