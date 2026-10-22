# Split rollout and training across GPUs

> On many GPUs, rollout and training run on separate devices and a transfer method moves the weights between them.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can choose a placement and a weight transfer method for many GPUs.

## What we know now

- We could not measure this on one GPU. This page will come from the Miles documentation and source.

```takeaways
- Start from the colocated layout and split only when rollout is the bottleneck.
- Measure the weight transfer time after the split.
```

Sources: Miles documentation at main 08752a12.
