# Why true on-policy mode is a contract

> Bit-exact agreement needs the same kernels on both sides, so true on-policy mode works only for the models and GPUs it lists.

GRPO assumes that the probability the engine gave a token is the probability the trainer computes for it. In every healthy run on our GB10, the two sides disagreed by 0.013 to 0.016 per token on average. This page explains where that gap comes from, and why closing it takes a contract and not a flag.

When you finish this section, you can explain why true on-policy mode covers only some models and GPUs.

## Two programs compute the same model

The engine and the trainer hold the same weights after each update. They still run different programs. The engine is built for speed: it batches many requests, picks kernels by batch size, and fuses operations. The trainer is built for gradients: it runs a different attention kernel and a different order of operations.

Floating-point addition gives slightly different results in a different order. The same long sum, added in two orders, can differ in its last bits. Across 28 layers and a vocabulary of 151,936 tokens, those bits add up to the gap we measured.

So the gap is not a bug in either side. It is the price of two programs that each do their own job well.

## Deterministic inference fixes the wrong half

Deterministic inference makes the engine give the same result for a request, whatever the batch around it. That makes the engine repeat itself. It does not make the engine compute like the trainer.

Our runs show this directly. With deterministic inference on, two runs repeated their first step to six decimal places, and the gap stayed at 0.015. [Section 4.5](#s-use-deterministic-inference) has the numbers.

```figure
id: fig-8-3
kind: comparison
title: Two fixes for two different halves
claim: Deterministic inference fixes the engine half, and only the true on-policy contract makes both halves the same.
caption: The trainer is on the left and the engine on the right.
```

## What the contract pins

To get a gap of exactly 0, both sides must run the same arithmetic in the same order. The contract in Miles pins that down for one family of models:

- The same attention kernel on both sides, FlashAttention 3.
- Operations that give the same result at any batch size.
- Log probabilities computed the way the engine computes its prefill.
- A profile per model, because each model has its own layers to match.

Each item removes one source of different ordering. Together they make the two programs agree bit for bit.

## Why it stops at Hopper and at Qwen3

Every pinned item is a piece of code that someone checked on specific hardware. FlashAttention 3 is built for Hopper GPUs. The batch-invariant operations and the model profile were checked for dense Qwen3 models. A new GPU or a new model needs its own kernels, checked the same way.

That is why we call it a contract and not a setting. A setting asks the code to try. A contract lists the cases where the code has been proven, and refuses the rest.

Our view: on a GPU outside the contract, do not chase a gap of 0. Measure the gap at step 0, keep it inside the range of your healthy runs, and remove the part that the sampler adds. That is the work you can finish.

```takeaways
- The gap comes from two programs that add in a different order, not from a bug.
- Deterministic inference makes the engine repeat itself, and true on-policy mode makes the two sides agree.
- Outside the contract, keep the gap in your healthy range instead of chasing 0.
```

Sources: Miles true on-policy contract, model profiles, and documentation at main 08752a12; capture/gpu/summary/miles-gb10-lab.json (runs.e6a-base, runs.e6b-det-triton, runs.e6c-det-flashinfer, runs.e6d-det-triton-repeat); Qwen3-0.6B model configuration.
