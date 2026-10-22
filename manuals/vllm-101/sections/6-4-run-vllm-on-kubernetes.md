# Run vLLM on Kubernetes

> A layer above vLLM adds routing and scaling, and you pick it by the features you need.

You must run many vLLM servers on a cluster. When you finish this section, you can pick the layer that runs vLLM on Kubernetes.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: the Helm chart, the production stack, llm-d, and KServe, with what each one adds.
- Evidence: sourced only. We have no cluster run.

```takeaways
- Start with the Helm chart for one model.
- Add a router when you run more than one replica.
```

Sources: vLLM documentation at v0.31.0 (docs/deployment/k8s.md).
