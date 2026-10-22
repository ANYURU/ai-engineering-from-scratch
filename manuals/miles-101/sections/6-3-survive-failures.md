# Keep a long run going after a failure

> Long runs on many machines lose engines and nodes, and Miles has fault tolerance and checkpoints for that.

A run on one GPU fails in simple ways, and you restart it. A run on hundreds of GPUs for days will lose an engine or a node along the way. The question is how much of the run you lose with it.

When you finish this section, you can set up checkpoints and fault tolerance for a long run, and test them before you rely on them.

We cannot test fault tolerance on our single GB10. On one GPU, a dead engine means a dead run, as [section 1.2](#s-add-a-watchdog) shows. This page comes from the Miles source and release notes.

## Save checkpoints first

Checkpoints protect you from every other failure. Set them before anything else:

```bash
--save /ckpt/run-a --save-interval 20 --load /ckpt/run-a
```

`--save-interval` counts steps. Choose it from the step time, so that a crash loses less work than you can accept. With a step of five minutes, an interval of 12 loses at most one hour.

Test a restart from a checkpoint on a short run, before the long run starts.

## Turn on fault tolerance

```bash
--use-fault-tolerance --ft-components rollout weight_update
```

`--ft-components` picks what Miles watches and replaces: `rollout`, `train`, and `weight_update`. Without the flag, Miles watches `rollout` and `weight_update`.

Rollout fault tolerance has a rule: the weight transfer must be `p2p`, and the layout must not be colocated. A rollout engine can stop in the middle of a weight update. Only that method can update a part of the engines, so the update can finish on the engines that are still alive.

## What the Miles team reports

The Miles team built a fault injector for its tests. Their release notes report a run where a rollout engine crashed. Its loss curve matched a run without a crash, bit for bit. That is their test on their hardware. Repeat a crash test on your own setup before you trust it.

## Known problems

- A report in the Miles issue tracker shows that the launcher cleanup stops a Ray cluster that you started yourself. Run Miles on its own Ray cluster.
- After an engine dies without fault tolerance, the trainer keeps sending requests to it and never fails. Add a watchdog to every run.

```takeaways
- Set checkpoints before fault tolerance, and test a restart on a short run.
- Use p2p weight transfer and a split layout if you need rollout fault tolerance.
- Test an engine crash on your own setup before a long run.
```

Sources: Miles fault tolerance, checkpoint, and weight update arguments at main 08752a12; Miles release notes v0.1.2; Miles issue 3649; capture/gpu/out-gb10/engine-died-503.log.
