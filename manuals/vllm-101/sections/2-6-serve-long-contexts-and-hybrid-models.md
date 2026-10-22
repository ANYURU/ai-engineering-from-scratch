# Serve long contexts and hybrid models

> A long context and a hybrid model each change how vLLM counts memory, and both can fail at startup for a reason the error hides.

A long-context or hybrid model fails at startup. When you finish this section, you can start a long-context or hybrid model and set its concurrency limit.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: the maximum model length flag, KV groups for hybrid models, and the cap that hybrid cache blocks put on concurrency.
- Evidence: sourced from the documentation and issues. We have no run for this page.

```takeaways
- Set the maximum model length to the context you need.
- Keep the sequence cap below the hybrid cache block count.
```

Sources: vLLM documentation at v0.31.0, issue 60838.
