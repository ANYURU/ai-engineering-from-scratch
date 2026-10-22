# Tune chat for many users

> For chat, the worst gap between tokens matters more than throughput, so watch P99 ITL as users grow.

Your chat service streams smoothly for a few users and stutters for many. When you finish this section, you can keep the stream steady as the number of users grows.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to (recipe).
- Covers: the maximum number of sequences, the batch token budget, and the defaults to leave on.
- Evidence: the GB10 runs, where vLLM tied SGLang on throughput but had about twice the P99 ITL at 32 and 64 users. The L4 run with a cap of 16 sequences.

```takeaways
- Watch P99 ITL, not only throughput, for chat.
- Change the sequence cap only after you measure your own load.
```

Sources: vLLM documentation at v0.31.0, capture/gpu/summary/gb10.json, capture/gpu/summary/l4.json.
