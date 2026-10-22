# Choose tensor, pipeline, or data parallelism

> Tensor parallelism splits a model that does not fit, and data parallelism copies a model that does.

One GPU is not enough. When you finish this section, you can pick the parallel layout from a short decision tree.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: tensor parallelism inside a node, data parallelism for throughput, pipeline parallelism across nodes, and context parallelism.
- Evidence: planned. A run on two L4s on one host is not done yet.

```takeaways
- Use tensor parallelism only when the model does not fit.
- Use data parallelism when the model fits and you need more throughput.
```

Sources: vLLM documentation at v0.31.0 (docs/serving/parallelism_scaling.md).
