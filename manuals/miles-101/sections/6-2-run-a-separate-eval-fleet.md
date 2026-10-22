# Run a separate evaluation fleet

> A separate evaluation fleet keeps evaluation from stopping training, and it needs GPUs of its own.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can decide when evaluation needs its own GPUs.

## What we know now

- We could not measure this on one GPU.

```takeaways
- Run evaluation on the shared engine until it slows training.
- Move evaluation to its own GPUs when it does.
```

Sources: Miles evaluation code at main 08752a12.
