# Count the memory before you pick a GPU

> The KV cache, not the weights, decides how many users fit, and you can count it from four numbers in the model config.

You chose a GPU and the server holds fewer users than you planned. When you finish this section, you can predict the KV pool and the number of users for a model and a context length.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: KV bytes per token from the layer count, the KV heads, the head size, and the data type. A worked Qwen3-8B example. A fit table for 24, 48, 80, and 128 GB.
- Evidence: the GPU KV cache size line from the L4 baseline run, compared with the formula.

```takeaways
- Count KV bytes per token before you buy or rent a GPU.
- Compare your count with the GPU KV cache size line at startup.
```

Sources: vLLM documentation at v0.31.0 (docs/configuration/optimization.md), the model config of Qwen/Qwen3-8B, capture/gpu/summary/l4.json.
