# Size memory on a DGX Spark

> On unified memory the GPU and the operating system share one pool, so read free memory from the system, not only from the GPU.

You run vLLM on a DGX Spark or another machine where the CPU and the GPU share memory. When you finish this section, you can pick a memory fraction that leaves room for the operating system. You also know why the first start takes minutes.

## Know what "GPU memory" means here

The GB10 in a DGX Spark has no separate GPU memory. The CPU and the GPU use the same 128 GB of LPDDR5x. On our machine, the GPU reported 121.7 GiB in total, and the operating system, the page cache, and every other program use the same memory.

vLLM 0.31.0 knows this. On an integrated GPU it reads free memory from the operating system. The GPU driver reports too little free memory on these machines. It also releases its cached GPU memory when the whole system is more than 80 percent full. So `--gpu-memory-utilization` is a share of the whole machine, not of a separate card.

## Pick the fraction

Add the weights, the KV cache you want, and a few GiB for the startup profile and the CUDA graphs. Divide the sum by the total memory. Leave room for the operating system and the page cache, which use the same memory.

Our run with `Qwen/Qwen3-30B-A3B-Instruct-2507` in BF16 used a fraction of 0.75:

| Part | Size |
|---|---|
| The share for vLLM, 0.75 of 121.7 GiB | 91.3 GiB |
| The weights | 56.93 GiB |
| Free for the KV cache | 31.32 GiB |
| The rest, for the profile and the graphs | about 3 GiB |

At 96 KiB per token, the 31.32 GiB holds about 342,000 tokens. That is enough for more than 500 users with 640 tokens each. Our sweeps then fixed the pool at 234,960 tokens, to match the SGLang server on the same machine. The fraction left about 30 GiB for the operating system and every other program.

We ran one fraction only. A sweep of the fraction against the KV pool and the swap activity is planned and not run yet.

## Expect a slow first start

The first start took more than five minutes. The log shows where the time went:

```listing
title: the weight load on a GB10
source: capture/gpu/out-gb10/server-load-vllm.log
lang: text
note: 330 seconds to load 56.93 GiB of weights.
---
(EngineCore pid=143) INFO 10-21 10:58:45 [model_runner.py:407] Model loading took 56.93 GiB memory and 330.542793 seconds
```

The load copies each tensor from the memory-mapped safetensors file into the GPU allocation, one tensor at a time. On the GB10, a copy from a file-backed page is slow. An open vLLM issue measured about 1.7 ms for each tensor copied from the file view. A copy in host memory first took about 0.2 ms. Release 0.31.0 fixed one part of the cost for one family of mixture-of-experts models. For other models the cost stays.

Two things help:

- Keep the weights on the local NVMe drive, not on a network mount.
- Start the server once and keep it running. A restart pays the full load again.

## Check the fraction

After the start, read the two memory lines and the system memory:

```bash
grep -E "Model loading took|Available KV cache memory|GPU KV cache size" server.log
free -g
```

If `free -g` shows almost no available memory while the server is idle, lower the fraction by 0.05 and start again.

```takeaways
- On unified memory, the memory fraction is a share of the whole machine.
- Leave room for the operating system and the page cache, and check it with `free -g`.
- Expect minutes for the first weight load, and keep the server running.
```

Sources: the vLLM source at v0.31.0 (vllm/utils/mem_utils.py, vllm/platforms/cuda.py), the v0.31.0 release notes (weight loading on DGX Spark), vLLM issue 58726 (slow weight loading on GB10), capture/gpu/out-gb10/server-load-vllm.log, capture/gpu/summary/gb10.json.
