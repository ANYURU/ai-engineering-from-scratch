# Handle long responses with partial rollout

> Partial rollout stops the slowest answers from setting the time of every step.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can keep long answers from slowing every step.

## What we know now

- In our baseline, 0.30 to 0.34 of the answers hit the length limit in the first steps, and 0.08 to 0.12 by step 48.
- A run with partial rollout is planned.

```takeaways
- Measure the cut share before you raise the length limit.
- Try partial rollout when a few long answers set the step time.
```

Sources: capture/gpu/summary/miles-gb10-lab.json (runs.plain-48).
