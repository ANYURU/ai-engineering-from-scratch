# Why true on-policy mode is a contract

> Bit-exact agreement needs the same kernels on both sides, so true on-policy mode works only for the models and GPUs it lists.

Draft: not written yet. This page is a explanation page.

When you finish this section, you can explain why true on-policy mode covers only some models and GPUs.

## What we know now

- This page will explain the kernel contract behind true on-policy mode.

```takeaways
- Read the contract before you plan a true on-policy run.
- Use the gap metrics outside the contract.
```

Sources: Miles true on-policy code at main 08752a12.
