# Write a custom reward function

> A custom reward plugs in with one flag, and a reward with fractions needs a check on how the advantage is centered.

The reward decides what the model learns. Miles has a set of built-in rewards, and you can name your own function when none of them fits your task.

When you finish this section, you can plug in your own reward function and check its advantages before a long run.

We have not measured a custom reward on our GB10. Our runs used the built-in `math` reward, which gives 1 for a correct answer and 0 otherwise.

## Check the built-in rewards first

`--rm-type` picks a built-in reward. The ones you are most likely to need:

| `--rm-type` | Score |
|---|---|
| `math` | 1 when the answer matches the label, else 0 |
| `dapo` | the DAPO math score |
| `deepscaler` | the DeepScaleR rule-based score |
| `f1` | the F1 overlap with the label |
| `gpqa` | the score for GPQA multiple choice |
| `remote_rm` | the score from an HTTP reward service at `--rm-url` |

Add the prefix `boxed_` to a math type, such as `boxed_math`, to grade only the answer inside `\boxed{}`.

## Plug in your own function

Write the function in a Python file that the container can import:

```python
async def custom_rm(args, sample, **kwargs):
    answer = sample.response.strip()
    return 1.0 if answer.endswith(str(sample.label)) else 0.0
```

Then pass its import path:

```bash
--custom-rm-path my_rewards.custom_rm
```

Write the function with `async def`. The flag help shows a plain function, but Miles awaits the result, so a plain function fails. The function receives the run arguments and one sample, with the answer in `sample.response` and the label in `sample.label`. If it returns a dict, name the field that holds the reward with `--reward-key`.

## Test it before the run

Run the function on ten answers that you have scored by hand. Include a correct answer, a wrong answer, an empty answer, and an answer cut at the length limit. A reward that crashes on an empty answer can stop the rollout of the whole step.

## Check the advantages of fractional rewards

GRPO subtracts the mean reward of each group from each answer. When every answer in a group gets the same reward, every advantage should be 0, and the group teaches nothing.

A report in the Miles issue tracker shows that this fails for some fractions. A group of 16 answers, each scored 0.3, got an advantage of about 0.029 per answer, because 0.3 has no exact float32 form. A binary reward of 0 or 1 does not hit this.

If your reward gives fractions, find groups where every answer has the same reward and check that their advantages are 0. If they are not, round the rewards to values that a float32 holds exactly, such as multiples of 0.25.

```takeaways
- Use a built-in reward when one fits, because it is already tested.
- Write a custom reward as an async function, and test it on ten hand-scored answers.
- Check that groups with equal fractional rewards get advantages of 0.
```

Sources: Miles reward hub and reward arguments at main 08752a12; Miles issue 4019.
