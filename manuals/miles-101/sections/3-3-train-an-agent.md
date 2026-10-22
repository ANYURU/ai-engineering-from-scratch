# Train an agent with tool calls and many turns

> An agent rollout has many turns and tool calls, and Miles runs them through its own generate functions.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can run a multi-turn or tool-calling rollout on one GPU.

## What we know now

- We have not run an agent recipe on the GB10 yet.
- This page will start from the retool and search examples in the Miles repository.

```takeaways
- Start an agent recipe from a Miles example, not from scratch.
- Keep one turn per request in the first run.
```

Sources: Miles examples at main 08752a12.
