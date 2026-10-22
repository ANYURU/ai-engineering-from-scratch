# Get reproducible outputs

> A seed alone does not give the same output in a busy batch, and batch invariance costs speed.

You run evals and the scores change between runs. When you finish this section, you can get the same output for the same request.

## Know why outputs change

The vLLM documentation says plainly that vLLM does not promise the same output by default, for the sake of speed. Two things change the result of one request:

- **The batch.** The kernels split their sums by the batch size. The same request adds its numbers in a different order in a batch of 3 than in a batch of 30. Floating-point sums depend on the order. A small difference in one logit can change a sampled token, and every later token then differs.
- **The schedule.** In the default multiprocess server, the timing of requests decides which batch each one joins.

The seed defaults to 0 in the current engine, and you cannot unset it. Speculative decoding needs every worker to sample the same tokens. So a seed is always there, and it is not enough by itself.

## Pick the fix for your case

| Case | Fix | Cost |
|---|---|---|
| Offline evals with the `LLM` class | set `VLLM_ENABLE_V1_MULTIPROCESSING=0`, use the same seed, and send the same prompts in the same order | the engine runs in your process, so the schedule repeats |
| A server with live traffic | turn on the batch-invariant mode | slower kernels for every request |
| Greedy evals that must match exactly | combine greedy sampling with one of the two fixes above | as above |

Every fix also needs the same hardware, the same vLLM version, and the same settings. A new release or a new GPU changes the kernels, and the outputs change with them.

## Check the result

Run the same eval twice and compare the outputs token by token, not only the score. If they differ, send one failing prompt alone twice. If the two answers match when alone, the batch causes the difference.

Not measured on our hardware. We have not measured the speed cost of the batch-invariant mode on the L4 or the GB10.

```takeaways
- A seed is not enough, because the batch changes the order of the sums.
- Offline, run the engine in one process with the same seed and order.
- Online, only the batch-invariant mode gives the same output, at a speed cost.
```

Sources: vLLM documentation at v0.31.0 (docs/usage/reproducibility.md, docs/features/batch_invariance.md), the vLLM source at v0.31.0 (vllm/envs.py).
