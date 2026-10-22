# Keep CUDA graphs and compile on

> The default compile level is the right one for most servers, and eager mode costs a few percent of decode speed.

Startup takes minutes and you want it faster. When you finish this section, you can decide what each compile level and eager mode cost.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: the compile levels from O0 to O3, eager mode, and startup time against decode speed.
- Evidence: the GB10 runs, where eager mode cost 1.5 to 5 percent of time per token. The L4 runs at O0, O1, and O3, which are running now.

```takeaways
- Leave the default compile level on for production.
- Use O0, not eager mode, when you only want to skip compile.
```

Sources: vLLM documentation at v0.31.0 (docs/design/optimization_levels.md), capture/gpu/summary/gb10.json.
