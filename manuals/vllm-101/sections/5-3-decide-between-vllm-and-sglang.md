# Decide between vLLM and SGLang

> On one model and one GPU the engines tie on throughput, and the shape of your traffic decides latency.

You must choose an engine for one workload. When you finish this section, you can read a head-to-head as a decision for your own workload.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: the default differences between the engines, and what each of our head-to-heads means for one kind of traffic.
- Evidence: the L4 head-to-heads for load, rate, waves, and prefixes, and the GB10 runs.

```takeaways
- Compare engines at matched memory pools and clocks.
- Decide on P99 ITL for chat and on throughput for batch work.
```

Sources: capture/gpu/summary/l4.json, capture/gpu/summary/gb10.json.
