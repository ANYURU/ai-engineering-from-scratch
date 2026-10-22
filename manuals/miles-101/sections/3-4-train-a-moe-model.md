# Train a mixture-of-experts model with routing replay

> Routing replay makes the trainer use the same experts that the engine chose, so the two sides agree on a MoE model.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can decide when to turn on routing replay for a mixture-of-experts model.

## What we know now

- We have not run a mixture-of-experts model with Miles on one GPU yet.
- Until a Qwen3-30B-A3B run fits, this page uses the numbers from the Miles release notes.

```takeaways
- Turn on routing replay for every mixture-of-experts run.
- Compare the log probability gap with and without replay.
```

Sources: Miles release notes; Miles routing replay code at main 08752a12.
