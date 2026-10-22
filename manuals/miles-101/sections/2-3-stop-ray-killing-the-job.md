# Stop Ray from killing the job on unified memory

> On a GB10, the GPU allocations count in the memory that Ray watches, so Ray can stop the trainer before the GPU runs out.

Our Qwen3-4B run finished its first rollout, then stopped in the training phase of that step, 15 minutes after start. The log holds no CUDA out-of-memory error. Ray had stopped the trainer because the node looked full.

When you finish this section, you can recognize a Ray memory kill and decide what to change.

## Read the kill message

Search the log for `OutOfMemoryError` before you lower the model size. A Ray memory kill names the node, not a GPU:

```listing
title: Ray stops the trainer of a Qwen3-4B run
source: capture/gpu/out-gb10/ray-oom-4b.log
lang: text
note: The first line gives the share of node memory in use. The table lists the largest processes. The last line names the two settings that control the kill.
---
(TrainerController pid=2656) ray.exceptions.OutOfMemoryError: 1 worker(s) were killed due to the node running low on memory. Memory on the node (IP: 172.17.0.3, ID: 08904870a17c5413c623abfc21db2e7fcfdc39d5be90e997b2391f37) was 115.86GB / 121.69GB (0.952127)
(TrainerController pid=2656) Top 10 memory users: PID	MEM(GB)	COMMAND
(TrainerController pid=2656) 2657	36.77	ray::FSDPTrainRayActor.train
(TrainerController pid=2656) 3402	2.73	sglang::scheduler
(TrainerController pid=2656) 2650	1.33	ray::RolloutExecutor
To adjust the kill threshold, set the environment variable `RAY_memory_usage_threshold` when starting Ray. To disable worker killing, set the environment variable `RAY_memory_monitor_refresh_ms` to zero.
```

The node held 115.86 GB of 121.69 GB, which is 95.2 percent. The trainer process alone held 36.77 GB.

## Why this happens on a GB10

On a GB10, the CPU and the GPU use one pool of memory. Ray reads the memory of the whole node. So the model weights, the optimizer state, and the KV cache all count in the number that Ray watches.

On a machine with a separate GPU, those bytes live in GPU memory. Ray does not see them, and the same job leaves more host memory free.

Ray stops a worker when the node passes its kill threshold. The kill came at 95.2 percent, so the threshold was at or below that share.

## Change the threshold or the model

You have two choices:

1. Raise the threshold. Pass `RAY_memory_usage_threshold` to the container, for example `-e RAY_memory_usage_threshold=0.98`. Ray then stops a worker only when the node is closer to full.
2. Lower the memory that the run needs. Use a smaller model, a lower `--sglang-mem-fraction-static`, or fewer samples per step.

A higher threshold leaves less room before the real limit. If the node does run out, the kernel stops a process with no Ray message at all. So raise the threshold in small steps and watch the node memory.

We have not proven the first choice yet. A rerun of the same Qwen3-4B job with `RAY_memory_usage_threshold=0.98` is in our queue. Until it finishes, the measured facts are the kill and its numbers above.

```takeaways
- Read the Ray OutOfMemoryError line before you lower the model size.
- On unified memory, count the GPU allocations as node memory.
- Raise RAY_memory_usage_threshold in small steps, and watch the node memory while you do.
```

Sources: capture/gpu/out-gb10/ray-oom-4b.log; capture/gpu/summary/miles-gb10-lab.json (excluded.e4-4b); Ray memory monitor message in the e4-4b run log.
