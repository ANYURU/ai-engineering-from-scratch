# Survive failures on a cluster

> Long runs on many machines fail, and Miles has fault tolerance and restart paths for that.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can keep a long run going after a node fails.

## What we know now

- We could not measure this on one GPU. The issues show that the launcher can stop an external Ray cluster.

```takeaways
- Test a restart before you start a long run.
- Keep checkpoints often enough to lose less than one hour.
```

Sources: Miles issue 3649; Miles fault tolerance code at main 08752a12.
