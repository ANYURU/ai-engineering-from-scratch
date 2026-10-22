# Return valid JSON and tool calls

> Structured output makes the model produce valid JSON, at a cost you can measure on your own schema.

Your application needs JSON that always parses. When you finish this section, you can request structured output and check its cost.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to (recipe).
- Covers: the response format field, the structured output options, and the known problems with speculative decoding.
- Evidence: planned. We have not measured the structured output overhead yet.

```takeaways
- Use the response format field for JSON.
- Serve structured requests without speculative decoding until the known bugs close.
```

Sources: vLLM documentation at v0.31.0 (docs/features/structured_outputs.md), issues 60830 and 61383.
