# Get reproducible outputs

> A seed alone does not give the same output in a busy batch, and batch invariance costs speed.

You run evals and the scores change between runs. When you finish this section, you can get the same output for the same request.

## Know why outputs change

The vLLM documentation says that vLLM does not promise the same output by default, for the sake of speed. Three things change the result of one request:

- **The batch.** The kernels split their sums by the batch size. The same request adds its numbers in a different order in a batch of 3 than in a batch of 30. Floating-point sums depend on the order. A small difference in one logit can change a sampled token, and every later token then differs.
- **The schedule.** In the default multiprocess server, the timing of requests decides which batch each one joins.
- **The prefix cache.** A request that reuses cached blocks computes its prompt in a different way than a request with no cache hit. The 2026 paper "Same Request, Different Answer" tested vLLM 0.11 and found that greedy outputs can differ between the cache-hit path and the path without a hit.

The seed defaults to 0 in the current engine, and you cannot unset it. Speculative decoding needs every worker to sample the same tokens. So a seed is always there, and it is not enough by itself.

## Pick the fix for your case

| Case | Fix | Cost |
|---|---|---|
| Offline evals with the `LLM` class | set `VLLM_ENABLE_V1_MULTIPROCESSING=0`, use the same seed, and send the same prompts in the same order | the engine runs in your process, so the schedule repeats |
| A server with live traffic | turn on the batch-invariant mode, as the next section shows | slower kernels for every request |
| Greedy evals that must match exactly | combine greedy sampling with one of the two fixes above | as above |

Every fix also needs the same hardware, the same vLLM version, and the same settings. A new release or a new GPU changes the kernels, and the outputs change with them.

## Turn on the batch-invariant mode

Set one environment variable when you start the server:

```bash
VLLM_BATCH_INVARIANT=1 vllm serve Qwen/Qwen3-8B 2>&1 | tee server.log
```

The mode needs an NVIDIA GPU with compute capability 8.0 or higher, which includes the L4 and the GB10. The vLLM documentation lists Qwen3-8B among the models it tested in this mode. The mode turns off some speed features that change the order of the sums, such as custom all-reduce with tensor parallelism. We did not run this mode, so check the result with the test at the end of this page.

## Know what the batch-invariant mode does not cover

At 0.31.0 the mode is in beta. Work by other teams shows three limits. We did not measure them ourselves:

- **The speed cost.** In the post "Defeating Nondeterminism in LLM Inference" of September 2025, Thinking Machines Lab ran 1,000 Qwen3-8B requests on vLLM. They took 26 s by default and 55 s with batch-invariant kernels, and 42 s with a better attention kernel. The 2026 CoRun paper reports that batch-invariant kernels more than double the latency and cut throughput by up to 74 percent.
- **Other changes in execution.** The 2026 paper "Vosti: Specifying, Implementing, and Verifying Deterministic LLM Inference" tested changes such as prompt chunking and KV cache reuse. The batch-invariant mode of vLLM gave different logits under some of them.
- **Some model paths.** At 0.31.0, a model that picks its own attention backend skips the check for the mode, so its output can still depend on the batch. Release 0.32.0 checks the backend of every attention layer. A fix for MoE models with data, tensor, and expert parallelism under torch.compile came after 0.32.0.

So test the exact setup that you serve: the model, the parallel layout, the prefix cache setting, and the token budget.

## Check the result

Run the same eval twice and compare the outputs token by token, not only the score. Between the two runs, reset the prefix cache or restart the server, as [the benchmark page](#s-benchmark-your-server-in-15-minutes) shows. If the outputs differ, send one failing prompt alone twice. If the two answers match when alone, the batch causes the difference.

Not measured on our hardware. We have not measured the speed cost of the batch-invariant mode on the L4 or the GB10.

```takeaways
- A seed is not enough, because the batch changes the order of the sums.
- Offline, run the engine in one process with the same seed and order.
- Online, the batch-invariant mode is the main fix, but it costs speed and misses some paths.
- Reset the prefix cache between two runs that you compare.
```

Sources: vLLM documentation at v0.31.0 (docs/usage/reproducibility.md, docs/features/batch_invariance.md), the vLLM source at v0.31.0 (vllm/envs.py), Same Request, Different Answer: Quantization Amplifies Cache-Induced Divergence in LLM Serving (arXiv 2609.04748, 2026), Defeating Nondeterminism in LLM Inference by Horace He and Thinking Machines Lab (2025-09-10), CoRun: Padding is Simple and Efficient for Deterministic LLM Inference (arXiv 2608.14376, 2026), Vosti: Specifying, Implementing, and Verifying Deterministic LLM Inference (arXiv 2609.38981, 2026), the release notes for v0.32.0 (attention backend check for the batch-invariant mode).
