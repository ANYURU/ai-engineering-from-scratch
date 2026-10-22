# Run vLLM in production

> vLLM releases every two weeks, so pin the image and plan for cold starts and upgrades.

Your server must survive restarts and upgrades. When you finish this section, you can deploy a server that starts fast and upgrades safely.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: image pins, the release cadence, cold start, graceful shutdown, security advisories, and the order to change settings.
- Evidence: the startup times from our logs. A warm-start measurement is planned.

```takeaways
- Pin the image by digest.
- Read the release notes before every upgrade.
```

Sources: vLLM documentation at v0.31.0 (docs/deployment/docker.md), capture/gpu/out-gb10/server-load-vllm.log.
