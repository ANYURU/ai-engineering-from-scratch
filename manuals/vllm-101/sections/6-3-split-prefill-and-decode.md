# Split prefill and decode

> Separate prefill and decode servers pay only when long prompts hurt the stream of other users.

Long prompts slow the stream for every user. When you finish this section, you can decide when disaggregated serving pays.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: KV connectors, the transfer layer, and the two-GPU setup from the project tests.
- Evidence: planned. We have not run this on two L4s yet.

```takeaways
- Measure the stream stall before you split servers.
- Start with two GPUs on one host.
```

Sources: vLLM documentation at v0.31.0 (docs/features/disagg_prefill.md).
