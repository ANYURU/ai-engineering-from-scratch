# Repeat a run and compare

> One run cannot tell an effect from noise, so a change needs a second seed before you trust it.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can tell a real effect from seed noise.

## What we know now

- Our three seeds ended between 0.74 and 0.77 in reward, so a difference under 0.03 is inside the noise.
- The heat guard paused many runs on our GB10, and those pauses change the step time. A test that pauses leave the results unchanged is planned.

```takeaways
- Run a second seed for every change you want to report.
- Report time only from runs without thermal pauses.
```

Sources: capture/gpu/summary/miles-gb10-lab.json (runs.plain-48, runs.plain-48-s2, runs.plain-48-s3); capture/gpu/out-gb10 thermostat log.
