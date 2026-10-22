# Memory on unified memory

> On a GB10 the CPU and the GPU share one memory, so offload moves bytes inside one pool.

Draft: not written yet. This page is a explanation page.

When you finish this section, you can explain what offload does on a machine with shared memory.

## What we know now

- This page will use the offload runs from section 2.2.

```takeaways
- Read memory use from the host and the GPU together.
- Measure offload on shared memory before you assume a cost.
```

Sources: capture/gpu/summary/miles-gb10-lab.json (runs.e3b-offload-kv, runs.e3c-no-offload-rollout, runs.e3d-no-offload-train).
