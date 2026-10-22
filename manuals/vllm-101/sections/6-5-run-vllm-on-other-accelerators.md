# Run vLLM on other accelerators

> vLLM supports other accelerators through plugins, and each plugin follows its own release.

Your hardware is not an NVIDIA GPU. When you finish this section, you can find the plugin for your hardware and its version.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to.
- Covers: the platform plugin system, and the plugins for AMD, TPU, Gaudi, Ascend, Neuron, and Apple silicon.
- Evidence: sourced only. We have no run on other accelerators.

```takeaways
- Use the plugin that matches your hardware.
- Pin the plugin version with the vLLM version.
```

Sources: vLLM documentation at v0.31.0 (docs/design/plugin_system.md).
