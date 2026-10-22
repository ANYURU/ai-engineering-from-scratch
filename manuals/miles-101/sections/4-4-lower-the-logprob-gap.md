# Lower the log probability gap with top-p and top-k replay

> When you sample with top-p or top-k, replaying that support in the trainer cuts the gap between the two sides.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can lower the gap that comes from the sampler.

## What we know now

- With top-p 0.95 and top-k 64, the median log probability gap fell from 0.0153 to 0.0135, about 11 percent.
- This was one seed of 12 steps.

```takeaways
- Turn on replay when you sample with top-p or top-k.
- Check the gap with a second seed before you report it.
```

Sources: capture/gpu/summary/miles-gb10-lab.json (runs.e6a-base, runs.e11-topp-topk).
