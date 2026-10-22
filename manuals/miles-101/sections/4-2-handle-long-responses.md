# Handle long responses with partial rollout

> Partial rollout stops the slowest answers from setting the time of every step.

A rollout step ends when its last answer ends. If a few answers run to the length limit, the whole step waits for them, and the engine sits half empty while it does.

When you finish this section, you can measure how much the long answers cost you, and keep them from slowing every step.

We have not run partial rollout on our GB10. The measured part of this page is the cut share of our baseline runs.

## Measure the long answers first

`rollout/truncated` reports the share of answers that hit the length limit, `--rollout-max-response-len`. Our three baseline seeds used a limit of 1,024 tokens:

| Seed | Cut share, first 8 steps | Cut share, last 8 steps |
|---|---|---|
| default (1234) | 0.33 | 0.08 |
| 2 | 0.30 | 0.12 |
| 3 | 0.34 | 0.09 |

At the start, about a third of the answers hit the limit. By step 48 the model had learned shorter answers, and about a tenth did.

A high cut share has two costs. A cut answer usually stops before its final answer, so the math reward scores it 0. And the step waits for the longest answers.

## Choose between a higher limit and partial rollout

If the cut answers are close to right, raise `--rollout-max-response-len`. The model then gets credit for long correct answers, and each step takes longer.

If a few very long answers set the step time, use partial rollout instead:

```bash
--partial-rollout --over-sampling-batch-size 48 --dynamic-sampling-filter-path miles.rollout.filter_hub.dynamic_sampling_filters.check_reward_nonzero_std
```

The filter path is the one from [section 3.2](#s-train-with-the-dapo-filter), which Miles marks as deprecated.

With partial rollout, the step takes the groups that finish first. Groups that are not done go back to the data buffer, and a later step continues them from the tokens they already have. The engine does not generate those tokens again.

Partial rollout works together with over-sampling. `--over-sampling-batch-size` sets the size of each new batch of prompts that the rollout starts when it runs short of finished groups. Keep such a run synchronous. `--fully-async` and the session server both refuse `--partial-rollout`. The multi-turn and agent generate functions do not support it either.

## The cost of continued answers

A continued answer starts under one set of weights and ends under a later one. So part of its tokens come from older weights. Watch the gap between the trainer and the engine, as in [section 5.2](#s-check-the-first-step), after you turn partial rollout on.

```takeaways
- Read the cut share before you change the length limit.
- Raise the limit when the cut answers are close to right.
- Use partial rollout when a few long answers set the step time, and then watch the gap.
```

Sources: capture/gpu/summary/miles-gb10-lab.json (runs.plain-48, runs.plain-48-s2, runs.plain-48-s3); Miles partial rollout and over-sampling arguments and the single-turn generate function at main 08752a12.
