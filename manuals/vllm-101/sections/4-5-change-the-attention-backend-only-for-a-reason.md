# Change the attention backend only for a reason

> vLLM picks the attention backend for your GPU, and you have two reasons to override it.

A post says a different attention backend is faster. When you finish this section, you can read the backend vLLM picked and decide when to override it.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: the default backend for each GPU class, the order vLLM tries them in, and the switch that an FP8 KV cache forces.
- Evidence: the backend line from our GB10 log. A backend comparison on the GB10 is planned and not run yet.

```takeaways
- Read the attention backend line before you change it.
- Override the backend only to fix a startup failure or a measured slowdown.
```

Sources: vLLM documentation at v0.31.0, capture/gpu/out-gb10/server-load-vllm.log.
