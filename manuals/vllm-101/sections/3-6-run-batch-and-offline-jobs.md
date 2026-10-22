# Run batch and offline jobs

> When nobody waits for the first token, push concurrency up until throughput stops growing.

You must process a large set of prompts overnight. When you finish this section, you can get the most tokens per second when latency does not matter.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to (recipe).
- Covers: the offline Python class against the server, a high sequence cap, and the throughput benchmark.
- Evidence: the L4 load and rate runs, which show where throughput stops growing.

```takeaways
- Raise concurrency until throughput stops growing.
- Use the throughput benchmark to find that point.
```

Sources: vLLM documentation at v0.31.0 (docs/benchmarking), capture/gpu/summary/l4.json.
