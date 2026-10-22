# Benchmark your server in 15 minutes

> One sweep over concurrency finds the point where your latency starts to grow, and four defaults change the result.

You must know how many users one server can hold. When you finish this section, you can run one sweep and find the knee of the latency curve.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: the serving benchmark, warmup requests, the seed and the prefix cache, closed loop against a fixed rate, and the sweep command.
- Evidence: the L4 baseline run as the worked example.

```takeaways
- Change the seed or reset the prefix cache between runs.
- Report TTFT, TPOT, and throughput together.
```

Sources: vLLM documentation at v0.31.0 (docs/benchmarking), capture/gpu/summary/l4.json.
