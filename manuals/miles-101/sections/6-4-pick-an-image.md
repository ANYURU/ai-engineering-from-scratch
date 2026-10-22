# Pick an image for your GPU

> The image decides which kernels your GPU can run, so pick it from your GPU generation.

Draft: not written yet. This page is a how-to page.

When you finish this section, you can choose the Miles image for your GPU.

## What we know now

- The arm64 image ran on our GB10 with FSDP training and the default attention.

```takeaways
- Record the image digest for every run.
- Check which attention kernels your GPU supports before a run.
```

Sources: capture/gpu/out-gb10/image-identity.txt.
