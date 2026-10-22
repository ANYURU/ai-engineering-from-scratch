# Use vLLM as an RL rollout engine

> An RL trainer borrows the server between steps, and vLLM gives it routes to sleep, wake, and load new weights.

Your RL trainer must generate rollouts and then update the weights. When you finish this section, you can name the control routes an RL framework calls.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to (recipe).
- Covers: sleep mode, the pause and update routes, and the external launcher.
- Evidence: planned. We have not timed sleep and wake yet. The Miles 101 manual covers the SGLang side.

```takeaways
- Use sleep mode when the trainer and the server share one GPU.
- Time a weight update before you plan a step budget.
```

Sources: vLLM documentation at v0.31.0 (docs/features/sleep_mode.md).
