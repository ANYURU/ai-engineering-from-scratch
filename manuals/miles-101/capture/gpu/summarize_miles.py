import ast
import json
import re
import statistics
import sys
from pathlib import Path

ANSI = re.compile(r"\x1b\[[0-9;]*m")
LINE = re.compile(r" - (perf|step|rollout) (\d+): (\{.*\})\s*$")
BARE = re.compile(r"(?<=[:\s\[,])(nan|inf|-inf)(?=[,}\]])")
KEEP = {
    "rollout/raw_reward": "reward",
    "rollout/episode_response_length/mean": "length",
    "rollout/truncated": "cut_share",
    "train/train_rollout_logprob_abs_diff": "logprob_abs_diff",
    "train/train_rollout_kl": "train_rollout_kl",
    "train/entropy_loss": "entropy",
    "train/grad_norm": "grad_norm",
    "train/pg_clipfrac": "clip_fraction",
    "perf/step_time": "step_time_s",
    "perf/rollout_time": "rollout_time_s",
    "perf/log_probs_time": "log_probs_time_s",
    "perf/train_time": "train_time_s",
    "perf/update_weights_time": "update_weights_time_s",
    "perf/sleep_time": "sleep_time_s",
    "perf/wake_up_time": "wake_up_time_s",
}


def parse(path):
    steps = {}
    with open(path, errors="ignore") as handle:
        for raw in handle:
            if " - " not in raw or "{" not in raw:
                continue
            match = LINE.search(ANSI.sub("", raw))
            if not match:
                continue
            try:
                values = ast.literal_eval(BARE.sub("None", match.group(3)))
            except (ValueError, SyntaxError):
                continue
            row = steps.setdefault(int(match.group(2)), {})
            for key, name in KEEP.items():
                if key in values and values[key] is not None and name not in row:
                    row[name] = round(float(values[key]), 6)
    return [dict(step=index, **steps[index]) for index in sorted(steps)]


def median_of(rows, name):
    values = [row[name] for row in rows if name in row]
    return round(statistics.median(values), 6) if values else None


def main(runs_dir, out_file):
    runs_dir = Path(runs_dir)
    status = {}
    for line in (runs_dir / "status.txt").read_text().splitlines():
        if " EXIT=" in line:
            name, code = line.rsplit(" EXIT=", 1)
            status[name.strip()] = int(code)
    runs = {}
    for name, code in status.items():
        log = runs_dir / f"{name}.log"
        if code != 0 or not log.exists():
            continue
        rows = parse(log)
        if not rows:
            continue
        runs[name] = {
            "steps": len(rows),
            "median": {field: median_of(rows, field) for field in KEEP.values()},
            "per_step": rows,
        }
    summary = {
        "machine": "NVIDIA DGX Spark GB10, 128 GB unified memory",
        "image": "radixark/miles:latest",
        "model": "Qwen/Qwen3-0.6B unless the run name says otherwise",
        "dataset": "zhuzilin/gsm8k",
        "excluded": {name: code for name, code in status.items() if code != 0},
        "runs": runs,
    }
    Path(out_file).write_text(json.dumps(summary, indent=1) + "\n")
    print(f"{len(runs)} runs written to {out_file}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
