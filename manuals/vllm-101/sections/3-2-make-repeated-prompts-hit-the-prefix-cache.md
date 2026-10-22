# Make repeated prompts hit the prefix cache

> Prefix caching is on by default, and it pays only when the shared part of the prompt comes first.

Every request repeats the same long system prompt. When you finish this section, you can order a prompt so that the cache hits, and prove the hit from a metric.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to (recipe).
- Covers: prompt order, the cache salt for tenant isolation, and the prefix cache hit metrics.
- Evidence: the L4 run with prefix caching on and off. With 4,096 shared tokens, the cache cut the median first-token time about 36 times.

```takeaways
- Put the shared part of the prompt first.
- Read the prefix cache hit rate after a change.
```

Sources: vLLM documentation at v0.31.0 (docs/design/prefix_caching.md), capture/gpu/out-l4/server-h2h-prefix-vllm.log, capture/gpu/summary/l4.json.
