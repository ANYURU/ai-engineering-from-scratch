# Leave async scheduling on

> Async scheduling is on by default, and some features turn it off without asking you.

You read that async scheduling makes vLLM faster. When you finish this section, you can know when async scheduling is on and when a feature turns it off.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: the default, and the features that turn it off.
- Evidence: the GB10 runs, where async scheduling made no difference to throughput or latency for Qwen3-30B-A3B.

```takeaways
- Leave async scheduling at the default.
- Check the startup log when you add speculation.
```

Sources: vLLM documentation at v0.31.0, capture/gpu/summary/gb10.json.
