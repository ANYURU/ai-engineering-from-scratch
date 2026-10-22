# Pick a model size for one GPU

> The largest model you can train on one GPU is the one whose trainer copy and engine copy fit together.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can choose the largest model that trains and serves on the same GPU.

## What we know now

- Qwen3-0.6B and Qwen3-1.7B trained on our GB10 with the default settings.
- Ray stopped the Qwen3-4B run in the training phase of its first step. Section 2.3 explains why. A retry with the engine memory fraction at 0.2 and the default Ray threshold is queued.
- The fit table for 4B and 8B waits for that retry.

```takeaways
- Start with the smallest model that answers your task.
- Raise the model size one step at a time and record the peak memory.
```

Sources: capture/gpu/summary/miles-gb10-lab.json (runs.e4-0.6b, runs.e4-1.7b, excluded.e4-4b).
