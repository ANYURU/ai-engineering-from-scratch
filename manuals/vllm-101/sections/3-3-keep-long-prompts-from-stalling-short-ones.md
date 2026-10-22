# Keep long prompts from stalling short ones

> The batch token budget trades the first-token time against the gaps between tokens, so set it for the latency you promise.

Long prompts arrive and short requests stall behind them. When you finish this section, you can choose a batch token budget for your latency target.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to (recipe).
- Covers: chunked prefill, which is always on, the batch token budget, and the long prefill threshold.
- Evidence: the GB10 runs, where a budget of 16,384 gave a faster first token and a worse P99 ITL at 0.5 requests per second. The L4 sweep of 512, 2,048, and 16,384.

```takeaways
- Lower the batch token budget when gaps between tokens grow.
- Raise it only when the first-token time matters more.
```

Sources: vLLM documentation at v0.31.0, capture/gpu/summary/gb10.json.
