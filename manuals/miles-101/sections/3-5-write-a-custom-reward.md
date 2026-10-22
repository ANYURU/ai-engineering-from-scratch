# Write a custom reward function

> A custom reward plugs in with one flag, and fractional rewards need care because of how the advantage is centered.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can plug in your own reward function and check its advantages.

## What we know now

- We have not measured a custom reward yet.
- Miles issue 4019 reports a small nonzero advantage when every answer in a group gets the same fractional reward.

```takeaways
- Test a new reward on ten known answers before a run.
- Prefer binary rewards until you check the advantages.
```

Sources: Miles issue 4019; Miles reward code at main 08752a12.
