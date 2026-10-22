# Train math reasoning on GSM8K

> GSM8K with a binary reward is the smallest recipe that shows GRPO learning, and its group size decides how much each step teaches.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can train a small model on GSM8K and choose the group size and the batch size.

## What we know now

- Three seeds of 48 steps moved the reward from 0.61 to 0.65 up to 0.74 to 0.77.
- A run with 4 answers per prompt is running, and a run with 16 is queued. They decide the group size where the reward per hour is highest.
- Runs with 16 and 64 prompts per step are queued.

```takeaways
- Start from 32 prompts with 8 answers each.
- Watch the share of groups where every answer scored the same.
```

Sources: capture/gpu/summary/miles-gb10-lab.json (runs.plain-48, runs.plain-48-s2, runs.plain-48-s3).
