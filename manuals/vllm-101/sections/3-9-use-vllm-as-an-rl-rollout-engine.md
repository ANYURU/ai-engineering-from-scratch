# Use vLLM as an RL rollout engine

> An RL trainer borrows the server between steps, and vLLM gives it routes to sleep, wake, and load new weights.

Your RL trainer must generate rollouts and then update the weights. When you finish this section, you can name the control routes an RL framework calls.

## The loop

An RL step has two halves. The rollout half generates answers with the current weights. The training half computes a loss and updates the weights. Then the generator needs the new weights before the next rollout.

On one set of GPUs, the two halves take turns on the same memory. The generator must give its memory back during training and take it again after. The vLLM server provides the pieces for this, and many RL frameworks call them. The vLLM documentation lists verl, OpenRLHF, TRL, NeMo-RL, SkyRL, Prime-RL, and others among its users.

## The pieces

The routes below exist only when you start the server with `VLLM_SERVER_DEV_MODE=1`. They free memory, replace weights, and run methods on every worker. Never expose a server in this mode outside the network of the trainer.

**Sleep mode.** Start the server with `--enable-sleep-mode`. A call to `/sleep` frees GPU memory, and `/wake_up` takes it back. At the deeper of its two levels, sleep drops the weights too, which suits a step where the trainer sends new weights anyway. `--sleep-preserve-parameter-names` keeps frozen weights on the GPU, so they do not move each step.

**Pause and resume.** `/pause` stops new generation, and `/resume` starts it again. A pause can abort the running requests, wait for them, or keep them.

**Weight updates.** The trainer starts a transfer with `/init_weight_transfer_engine`, then calls `/start_weight_update`, sends the weights, and calls `/finish_weight_update`. The transfer can run over NCCL between GPUs or through CUDA memory handles on one machine. `/update_weight_version` records which version the next rollouts use.

**Collective calls.** `/collective_rpc` runs a method on every worker. Frameworks use it for setup that vLLM does not cover.

**External launch.** With `--distributed-executor-backend external_launcher`, a launcher such as `torchrun` starts the vLLM workers inside the trainer's processes. Some colocated frameworks use this path.

## Check the rollout logprobs

The trainer often compares the logprobs that vLLM returned with the logprobs it computes itself. The two never match exactly, because the kernels differ. A small, steady gap is normal. A gap that grows means the weights did not reach the generator. Track the gap every step. [The reproducibility page](#s-get-reproducible-outputs) explains why the same weights still give different numbers.

Not measured on our hardware. We have not timed sleep, wake, or a weight update on the L4 or the GB10. Our Miles 101 manual measures the same loop with SGLang as the generator.

```takeaways
- Sleep frees GPU memory for training, and wake takes it back.
- A weight update is a transfer that the trainer starts and finishes through the server routes.
- Track the gap between the generator and the trainer logprobs on every step.
```

Sources: the vLLM source at v0.31.0 (vllm/config/model.py, vllm/config/parallel.py, vllm/entrypoints/ api routers for sleep, rlhf, and rpc, vllm/distributed/weight_transfer/), vLLM documentation at v0.31.0 (docs/training/rlhf.md, docs/training/async_rl.md, docs/features/sleep_mode.md, docs/training/weight_transfer/), the release notes for v0.31.0 and v0.32.0.
