# Choose what to offload between phases

> On one GPU the trainer and the engine take turns, and the offload settings decide what each side gives back.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can decide which memory each side releases while the other side runs.

## What we know now

- The heat guard paused each offload run for about 24 minutes of its hour, and the phase times include those pauses.
- So these runs cannot compare rollout or training time yet. The rollout median was 25 percent shorter with the engine kept loaded, and we do not report that as a result.
- The weight update took 0.52 s with the trainer kept loaded and 0.64 s with the default settings.

```takeaways
- Keep the default offload settings until you have measured a reason to change them.
- Repeat any offload change with a second seed before you trust it.
```

Sources: capture/gpu/summary/miles-gb10-lab.json (runs.e6a-base, runs.e3b-offload-kv, runs.e3c-no-offload-rollout, runs.e3d-no-offload-train).
