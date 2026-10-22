# Choose what to offload between phases

> On one GPU the trainer and the engine take turns, and the offload settings decide what each side gives back.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can decide which memory each side releases while the other side runs.

## What we know now

- The heat guard paused each offload run for 24 to 27 minutes of about an hour. So we time only the steps whose rollout overlaps no pause. [The lab notes](#s-ref-lab-notes) give the rule.
- With that rule, the rollout median was 59.1 s with the default settings (6 steps). It was 57.8 s with only the KV cache offloaded (5 steps), and 59.8 s with the trainer kept loaded (6 steps).
- With the engine kept loaded, the rollout median was 52.0 s (7 steps). That run also used a memory fraction of 0.25 instead of 0.4, so two settings changed at once.
- Steps without a pause can still be slower on a hot card. The same default setting gave 47.5 s on another day.
- This is a lead from one seed, not a result. Three runs decide it: the default and the kept-loaded engine with a second seed, and the default at a memory fraction of 0.25.
- The weight update took 0.52 s with the trainer kept loaded and 0.64 s with the default settings.

```takeaways
- Keep the default offload settings until you have measured a reason to change them.
- Time only steps without a thermal pause, and repeat any offload change with a second seed.
```

Sources: capture/gpu/summary/miles-gb10-lab.json (runs.e6a-base, runs.e3b-offload-kv, runs.e3c-no-offload-rollout, runs.e3d-no-offload-train, runs.plain-48, median_unpaused); capture/gpu/out-gb10/unpaused-timing.txt.
