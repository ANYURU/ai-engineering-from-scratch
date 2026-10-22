# Train with the DAPO filter

> The DAPO filter drops groups where every answer scored the same, so each step trains only on groups that teach something.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can turn on the zero-variance filter and check how many groups it drops.

## What we know now

- A run with the filter and 48 prompts of over-sampling is queued.
- It decides the share of groups dropped and the reward change at the same number of prompts.

```takeaways
- Turn on the filter when many groups score the same for every answer.
- Count the dropped groups in every step.
```

Sources: the planned e2b run; Miles filter code at main 08752a12.
