# How rollout functions plug in

> Generate, reward, and filter functions plug into Miles by path, so a recipe changes code without a fork.

Draft: not written yet. This page is a explanation page.

When you finish this section, you can explain how a custom rollout function plugs into Miles.

## What we know now

- This page will explain the generate, reward, and filter hooks.

```takeaways
- Write a new rollout function as a plugin first.
- Fork Miles only when no hook fits.
```

Sources: Miles rollout code at main 08752a12.
