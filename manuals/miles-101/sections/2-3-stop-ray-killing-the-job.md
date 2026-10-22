# Stop Ray from killing the job on unified memory

> On a GB10, Ray counts GPU memory as host memory, so its memory monitor can stop a run that has room to spare.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can run a larger model on a GB10 without an out-of-memory kill from Ray.

## What we know now

- Ray stopped our Qwen3-4B run when the trainer process held 36.8 GB of host memory.
- A retry with RAY_memory_usage_threshold set to 0.98 is queued. It decides if this setting alone is enough.

```takeaways
- Read the Ray out-of-memory message before you lower the model size.
- Set the Ray memory threshold on unified memory machines.
```

Sources: capture/gpu/summary/miles-gb10-lab.json (excluded.e4-4b); the e4-4b run log on the lab machine.
