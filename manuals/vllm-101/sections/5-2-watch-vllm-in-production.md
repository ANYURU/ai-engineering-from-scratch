# Watch vLLM in production

> Five metrics show most problems before users report them.

Your server is in production and you must know when it is in trouble. When you finish this section, you can pick the metrics to alert on.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: running requests, KV cache usage, preemptions, first-token time buckets, and speculative decoding counters.
- Evidence: the L4 small-pool run, which shows preemptions in the metrics.

```takeaways
- Alert on preemptions and KV cache usage.
- Graph first-token time by bucket, not only the mean.
```

Sources: vLLM documentation at v0.31.0 (docs/design/metrics.md), capture/gpu/summary/l4.json.
