# How to read this manual

> This manual gets a GRPO run going on one GPU first, then shows how to size it, check it, and fix it.

This is a draft edition. Part 1 is written. The other parts give the goal of each page and the result we measured or plan to measure.

## What you can do after this manual

You can serve a model and you know what a reward is. You want to train a model with reinforcement learning, and you want to know which settings matter before you rent a cluster.

After the manual, you can:

- Run GRPO on one GPU with the `radixark/miles` image and read the first ten steps.
- Stop a run that keeps going after its rollout engine died.
- Pick a model size that fits training and rollout on one GPU.
- Check that a run is correct, and not only that it runs.
- Find the cause of a failed run from its first symptom.

## The short version

Three commands start a run. Section 1.1 explains each one.

```bash
docker pull radixark/miles:latest
docker run --rm --name miles-plain --gpus all --ipc=host --shm-size 32g -v "$HOME/miles-lab:/root/lab" -e MILES_NUM_ROLLOUT=12 radixark/miles:latest python /root/lab/miles_grpo.py > plain.log 2>&1
grep -o "'rollout/raw_reward': [0-9.]*" plain.log
```

## How we tested it

We ran every command on one NVIDIA DGX Spark, with a GB10 chip and 128 GB of memory that the CPU and the GPU share. The image was `radixark/miles:latest`, which held Miles main at `08752a12` and SGLang 0.5.22.dev46. The model was Qwen3-0.6B, and the data was GSM8K.

Miles is built for large mixture-of-experts runs on many GPUs. One GPU cannot show all of it. Each page says what we measured and what we could only read in the source. Lab notes in the reference part give the seeds, the clocks, and the full tables.

The overview of one Miles step is in the [Inside Miles guide](https://rohitghumare.com/guides/inside-miles), and the colocated loop is in [SGLang 101, section 7.2](https://aiengineeringfromscratch.com/manual-sglang-101.html#s-sglang-as-an-rl-rollout-engine). This manual does not repeat them.

## How the parts are ordered

```parts
```

Sources: manual.json; capture/gpu/out-gb10/image-identity.txt; capture/gpu/miles_grpo.py; capture/gpu/summary/miles-gb10-lab.json.
