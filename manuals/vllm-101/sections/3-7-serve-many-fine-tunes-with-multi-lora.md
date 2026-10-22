# Serve many fine-tunes with multi-LoRA

> One base model can serve many LoRA adapters, and the adapter count and rank set the cost.

You have many fine-tunes of one base model. When you finish this section, you can serve LoRA adapters per request from one base model.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to (recipe).
- Covers: the LoRA flags for the adapter count and the rank, and loading adapters at runtime.
- Evidence: planned. We have not measured multi-LoRA yet.

```takeaways
- Set the maximum adapter count and rank to what you serve.
- Measure TPOT with your real adapter count.
```

Sources: vLLM documentation at v0.31.0 (docs/features/lora.md), issue 60845.
