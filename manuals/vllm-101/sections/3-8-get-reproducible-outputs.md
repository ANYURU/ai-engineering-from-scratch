# Get reproducible outputs

> A seed alone does not give the same output in a busy batch, and batch invariance costs speed.

You run evals and the scores change between runs. When you finish this section, you can get the same output for the same request.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to (recipe).
- Covers: seeds, the batch invariance mode, and why outputs differ inside a batch by default.
- Evidence: planned. We have not measured batch invariance yet.

```takeaways
- Set a seed per request for evals.
- Turn on batch invariance only when you need identical outputs.
```

Sources: vLLM documentation at v0.31.0 (docs/features/batch_invariance.md).
