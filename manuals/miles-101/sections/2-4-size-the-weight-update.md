# Size the weight update for your model

> On one GPU the weight update is a small fixed cost, so it is not the step to tune first.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can know the time each step spends to copy new weights into the engine.

## What we know now

- The weight update took 0.64 s for Qwen3-0.6B and 0.91 s for Qwen3-1.7B.
- That is under one percent of a step on our GB10.

```takeaways
- Measure the weight update once for each model size.
- Tune the rollout and the training phase before the weight update.
```

Sources: capture/gpu/summary/miles-gb10-lab.json (runs.e4-0.6b, runs.e4-1.7b).
