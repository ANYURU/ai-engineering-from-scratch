# Why an RL framework owns an inference engine

> RL needs fast generation and exact probabilities, and one engine under the trainer's control gives both.

Draft: not written yet. This page is a explanation page.

When you finish this section, you can explain why Miles runs its own inference engine.

## What we know now

- This page will explain the four ways the trainer and the engine can disagree: tokens, routing, numbers, and staleness.

```takeaways
- Read the Inside Miles guide for one step from start to end.
- Use this part when you need the reason behind a setting.
```

Sources: Miles documentation at main 08752a12.
