# Know what deterministic inference fixes

> Deterministic inference makes the engine repeat itself, and it does not make the engine agree with the trainer.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can decide when deterministic inference is worth its cost.

## What we know now

- With deterministic inference on Triton or FlashInfer, the median gap was 0.0152, against 0.0153 without it.
- Two runs with the same seed gave the same gap at step 0, to six decimal places, and then drifted apart.

```takeaways
- Use deterministic inference to repeat an experiment.
- Do not use deterministic inference to close the gap with the trainer.
```

Sources: capture/gpu/summary/miles-gb10-lab.json (runs.e6a-base, runs.e6b-det-triton, runs.e6c-det-flashinfer, runs.e6d-det-triton-repeat).
