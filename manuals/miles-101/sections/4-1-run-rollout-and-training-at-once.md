# Run rollout and training at the same time

> Async training lets rollout run during training, but on one GPU the two phases still wait for each other.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can decide if async training helps your layout.

## What we know now

- We have not run async training on one GPU yet.
- On one GPU, generation stops for the training window, so we expect more staleness and no speed gain.

```takeaways
- Use async training only when rollout and training run on different GPUs.
- Record the weight version of every sample in an async run.
```

Sources: Miles async training code at main 08752a12.
