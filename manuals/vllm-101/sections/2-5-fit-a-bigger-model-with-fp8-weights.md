# Fit a bigger model with FP8 weights

> FP8 weights free memory for the KV cache, and the speed change depends on what your GPU supports.

Your model fits, but only with a small KV pool. When you finish this section, you can decide between a BF16 and an FP8 checkpoint at the same memory budget.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: the Qwen3-8B-FP8 checkpoint, online FP8, and which FP8 formats an L4 can run.
- Evidence: the L4 run with the FP8 checkpoint, which separates the KV room gained from the change in speed.

```takeaways
- Use a published FP8 checkpoint before you quantize online.
- Measure the KV room and the speed as two separate results.
```

Sources: vLLM documentation at v0.31.0 (docs/features/quantization/online.md), issue 58241, capture/gpu/summary/l4.json.
