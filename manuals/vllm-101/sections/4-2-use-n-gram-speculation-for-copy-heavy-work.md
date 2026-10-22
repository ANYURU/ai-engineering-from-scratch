# Use n-gram speculation for copy-heavy work

> N-gram speculation needs no draft model and pays when the answer copies the prompt, and it turns off async scheduling.

Your users ask for edits of documents they send. When you finish this section, you can decide when n-gram speculation beats a draft model.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: the n-gram speculative config, the model runner it needs, and the async scheduling it turns off.
- Evidence: the L4 n-gram run, which is running now.

```takeaways
- Try n-gram speculation for edit and summary work.
- Compare it with EAGLE3 on your own prompts.
```

Sources: vLLM documentation at v0.31.0 (docs/features/speculative_decoding).
