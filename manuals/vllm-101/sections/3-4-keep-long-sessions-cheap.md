# Keep long sessions cheap

> Old turns cost nothing while they stay in the cache, and offload keeps them when the GPU pool is full.

A long conversation slows down as it grows. When you finish this section, you can keep earlier turns cached without a full prefill.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to (recipe).
- Covers: prefix caching across turns, KV offload to host memory, and when an external KV cache helps.
- Evidence: planned. We have not run KV offload yet.

```takeaways
- Keep the conversation history in the same order on every turn.
- Measure offload before you add it.
```

Sources: vLLM documentation at v0.31.0 (docs/features/disagg_prefill.md and KV connector pages).
