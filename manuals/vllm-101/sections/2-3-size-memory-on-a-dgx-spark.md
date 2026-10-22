# Size memory on a DGX Spark

> On unified memory the GPU and the operating system share one pool, so read free memory from the system, not only from the GPU.

You run vLLM on a DGX Spark and the memory numbers do not add up. When you finish this section, you can pick a memory fraction on a 128 GB machine where GPU memory is system memory.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: how vLLM reads free memory on an integrated GPU, the memory pressure limit, and slow weight loading on the GB10 with its partial fix.
- Evidence: the GB10 run with Qwen3-30B-A3B at a memory fraction of 0.75. A sweep of the fraction is planned and not run yet.

```takeaways
- Read free memory from the system on a DGX Spark.
- Leave room for the operating system before you raise the fraction.
```

Sources: vLLM documentation at v0.31.0, issue 58726, capture/gpu/out-gb10/server-load-vllm.log, capture/gpu/summary/gb10.json.
