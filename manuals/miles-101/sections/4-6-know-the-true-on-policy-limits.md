# Know the limits of true on-policy mode

> True on-policy mode makes the trainer and the engine match bit for bit, but only for the models and GPUs its contract covers.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can check if your GPU and model can run true on-policy mode.

## What we know now

- True on-policy mode did not start on our GB10, because FlashAttention 3 supports Hopper GPUs only.
- Section 1.2 shows that failure and what the run did after it.

```takeaways
- Check the GPU generation before you plan a true on-policy run.
- Use the gap metrics on GPUs that the contract does not cover.
```

Sources: capture/gpu/out-gb10/engine-died-503.log; Miles true on-policy code at main 08752a12.
