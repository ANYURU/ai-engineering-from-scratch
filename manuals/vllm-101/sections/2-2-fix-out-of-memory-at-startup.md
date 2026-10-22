# Fix out of memory at startup

> One dial, the GPU memory fraction, decides most startup failures, and a lower concurrency cap fixes most of the rest.

The server stopped during startup with an out-of-memory error. When you finish this section, you can start a model that failed while vLLM allocated its KV cache.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: the GPU memory utilization flag and its default of 0.92. Also the exact KV memory flag, a lower sequence cap, and a shared GPU.
- Evidence: the L4 small-pool run, which shows what the server reports when the pool is too small.

```takeaways
- Lower the GPU memory fraction first when startup fails.
- Lower the maximum number of sequences when the profile run fails.
```

Sources: vLLM documentation at v0.31.0 (docs/configuration/conserving_memory.md), capture/gpu/summary/l4.json.
