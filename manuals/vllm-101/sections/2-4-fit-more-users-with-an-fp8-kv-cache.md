# Fit more users with an FP8 KV cache

> An FP8 KV cache doubles the tokens that fit, and on an L4 it also changes the attention backend without a warning.

Your server queues requests because the KV cache is full. When you finish this section, you can double the KV pool and check the cost in speed and accuracy.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: the KV cache data type flag, the backend vLLM picks after the change, and what to use when it cannot start.
- Evidence: the L4 run with an FP8 KV cache, compared with the BF16 baseline at the same load.

```takeaways
- Read the attention backend line after you change the KV data type.
- Check output quality on your own prompts before production.
```

Sources: vLLM documentation at v0.31.0 (docs/features/quantization/quantized_kvcache.md), issue 60262, capture/gpu/summary/l4.json.
