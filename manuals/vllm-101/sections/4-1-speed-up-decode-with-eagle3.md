# Speed up decode with EAGLE3

> EAGLE3 pays at low concurrency, and the draft depth that pays falls as more users share each step.

Your users wait for long answers at low load. When you finish this section, you can choose the draft depth for your concurrency.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: the speculative config with the Qwen3-8B EAGLE3 draft, acceptance metrics per request, and the concurrency where it stops paying.
- Evidence: the L4 runs with draft depths 1, 3, and 5, which are running now.

```takeaways
- Measure acceptance length on your own prompts.
- Turn speculation off above the concurrency where it stops paying.
```

Sources: vLLM documentation at v0.31.0 (docs/features/speculative_decoding).
