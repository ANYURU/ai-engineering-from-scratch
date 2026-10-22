# Troubleshoot by symptom

> Most failures have a known cause that one log line or one metric shows.

Something is wrong and you only know what users see. When you finish this section, you can go from a symptom to its likely cause, the check, and the fix.

## Draft: not written yet

This page is a plan. The list below says what the page will cover and the evidence it will use.

- Mode: how-to, by symptom.
- Covers: fifteen symptoms with their cause, check, and fix. Examples are out of memory at startup and a crash after an FP8 KV change. Others are a repeated token after a cache hit and slow loading on a DGX Spark.
- Evidence: issues 60174, 60262, 58726, and 59770, and our GB10 runs.

```takeaways
- Start from the symptom, then read one log line.
- Change one setting at a time.
```

Sources: vLLM documentation at v0.31.0, issues 58726, 59770, 60174, and 60262, capture/gpu/summary/gb10.json.
