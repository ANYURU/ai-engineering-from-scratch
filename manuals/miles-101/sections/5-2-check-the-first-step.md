# Check the first step before you trust the run

> At step 0 the trainer and the engine hold the same weights, so a large gap there means a broken setup.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can prove that the trainer and the engine start from the same weights.

## What we know now

- In our runs the gap at step 0 was 0.0136 to 0.0157, the same size as in later steps.

```takeaways
- Compare the step-0 gap with your healthy range.
- Stop a run whose gap at step 0 is far above the range.
```

Sources: capture/gpu/summary/miles-gb10-lab.json (per_step[0] of each run).
