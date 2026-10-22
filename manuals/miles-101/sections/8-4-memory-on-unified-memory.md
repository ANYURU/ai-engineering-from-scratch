# Memory and weight updates on unified memory

> On a GB10 the CPU and the GPU share one memory, so offload moves bytes inside one pool and the weight update never leaves the chip.

On one GPU, the trainer and the rollout engine cannot both hold all their memory at once. Miles makes them take turns. This page explains what each turn gives back, what the weight update does, and why a GB10 changes both stories.

When you finish this section, you can explain what offload and the weight update do on a machine with shared memory.

## Two sides take turns

With `--colocate`, the trainer and the engine share the same GPU. Each step has the same order:

1. The engine generates the answers for the step.
2. The engine releases its memory.
3. The trainer loads its state, computes the log probabilities, and trains.
4. The trainer releases its state.
5. The engine loads again and receives the new weights.

The `--colocate` flag also turns on offload for both sides. `--offload-rollout-level` decides what the engine gives back. The default is both of its memory tags: `kv_cache`, the cache of attention keys and values, and `weight`, the model weights.

## Offload on a normal machine and on a GB10

On a machine with a separate GPU, offload copies bytes from GPU memory to CPU memory over the bus. The copy is the cost.

On a GB10 there is no second memory. GPU memory and CPU memory are the same 128 GB. So offload frees the GPU allocation, and the bytes stay in the same pool. For Qwen3-0.6B, our release took a median of 1.6 s and our resume 0.8 s. That is small next to a step of more than two minutes.

Our view: on a GB10, part of the release and resume time is probably setup work, not copying. We have not measured that split.

## The weight update stays inside the GPU

After training, the engine needs the new weights. Under `--colocate`, the trainer shares handles to its GPU tensors with the engine, and the engine copies from them. The bytes never travel over a network.

The trainer sends the weights in buckets. `--update-weight-buffer-size` sets the bucket size, and our runs used 512 MiB. The update took 0.64 s for Qwen3-0.6B and 0.91 s for Qwen3-1.7B, under one percent of a step. [Section 2.4](#s-size-the-weight-update) has the table.

## One pool confuses one watcher

Shared memory also changes what other tools see. Ray reads the memory of the whole node. On a GB10 that number includes the model weights, the optimizer state, and the KV cache. So Ray can stop the trainer when the node looks full, before any GPU allocation fails. [Section 2.3](#s-stop-ray-killing-the-job) shows the kill and the setting that controls it.

## What we do not know yet

We do not yet know whether keeping the engine loaded between phases saves rollout time on a GB10. Our first run hinted at it, but that run changed two settings and ran on a hot card. [Section 2.2](#s-choose-what-to-offload) tracks the runs that decide it.

```takeaways
- With --colocate, the engine and the trainer take turns, and offload decides what each side gives back.
- On a GB10, offload frees memory inside one pool, and the weight update copies inside the GPU.
- Count the GPU allocations as node memory when a tool such as Ray watches the host.
```

Sources: Miles placement, offload, and weight update code at main 08752a12; capture/gpu/miles_grpo.py; capture/gpu/summary/miles-gb10-lab.json (runs.e4-0.6b, runs.e4-1.7b, runs.plain-48); capture/gpu/out-gb10/ray-oom-4b.log.
