# Serve MoE models with expert parallelism

> Expert parallelism spreads the experts of a MoE model across GPUs, and one GPU can still serve a small MoE model.

You serve a mixture-of-experts model. When you finish this section, you can decide when expert parallelism helps.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: expert parallelism, elastic expert parallelism, and the single-device path on a GB10.
- Evidence: the GB10 runs with Qwen3-30B-A3B on one device. Multi-GPU expert parallelism is sourced only.

```takeaways
- Serve a small MoE model on one GPU first.
- Add expert parallelism when the experts do not fit.
```

Sources: vLLM documentation at v0.31.0 (docs/serving/expert_parallel_deployment.md), capture/gpu/summary/gb10.json.
