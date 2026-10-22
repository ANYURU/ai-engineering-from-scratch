import argparse
import copy
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
GPU = HERE / "gpu"
OUT = GPU / "out-gb10"
SUMMARY = GPU / "summary" / "miles-gb10-lab.json"
PAUSES = OUT / "thermostat.log"
REPLAY_INPUT = OUT / "e2-n16-503-per-second.txt"
REPLAY_STORED = OUT / "503-bursts.txt"
REPLAY_COMMAND = "$ python3 watchdog_replay.py"

sys.dont_write_bytecode = True
sys.path.insert(0, str(GPU))
import summarize_miles


def lab_runs():
    folder = Path(os.environ.get("MILES_LAB_RUNS", Path.home() / "miles-lab" / "runs"))
    return folder if (folder / "status.txt").exists() else None


def replay_output():
    result = subprocess.run([sys.executable, str(GPU / "watchdog_replay.py"), str(REPLAY_INPUT)], capture_output=True, text=True, check=True)
    return result.stdout


def stored_replay():
    lines = REPLAY_STORED.read_text().splitlines()
    start = next(index for index, line in enumerate(lines) if line.startswith(REPLAY_COMMAND))
    return "\n".join(lines[start + 1:]) + "\n"


def summary_problems(summary):
    problems = []
    pauses = summarize_miles.load_pauses(PAUSES)
    if len(pauses) != summary["pauses"]:
        problems.append(f"the pause log holds {len(pauses)} pauses and the summary {summary['pauses']}")
    for name, run in summary["runs"].items():
        rows = copy.deepcopy(run["per_step"])
        summarize_miles.mark_pauses(rows, pauses)
        if rows != run["per_step"]:
            problems.append(f"{name}: the pause marks differ from the pause log")
        if run["steps"] != len(rows):
            problems.append(f"{name}: {run['steps']} steps recorded, {len(rows)} rows stored")
        median = {field: summarize_miles.median_of(rows, field) for field in summarize_miles.KEEP.values()}
        if median != run["median"]:
            problems.append(f"{name}: the medians differ from the stored steps")
        if summarize_miles.clean_medians(rows) != run["median_unpaused"]:
            problems.append(f"{name}: the clean-step medians differ from the stored steps")
    return problems


def fresh_summary_problems(runs):
    with tempfile.TemporaryDirectory() as folder:
        fresh = Path(folder) / "summary.json"
        summarize_miles.main(runs, fresh, runs / "thermostat.log")
        if json.loads(fresh.read_text()) != json.loads(SUMMARY.read_text()):
            return [f"a fresh summary of {runs} differs from {SUMMARY.name}"]
    return []


def check():
    problems = []
    if replay_output() != stored_replay():
        problems.append(f"the watchdog replay differs from {REPLAY_STORED.name}")
    problems += summary_problems(json.loads(SUMMARY.read_text()))
    runs = lab_runs()
    if runs is None:
        print("skipped: the raw run logs stay on the DGX Spark that recorded them, so only the stored outputs were compared. Set MILES_LAB_RUNS to a runs folder to compare a fresh summary.")
    else:
        problems += fresh_summary_problems(runs)
    for problem in problems:
        print(f"drift: {problem}")
    if problems:
        return 1
    print("capture check passed: watchdog replay, pause marks, and medians match the stored outputs")
    return 0


def run():
    runs = lab_runs()
    if runs is None:
        print("skipped: no runs folder with status.txt. The GPU captures record on the DGX Spark, see the lab notes.")
        return 0
    summarize_miles.main(runs, SUMMARY, runs / "thermostat.log")
    return check()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    return check() if args.check else run()


if __name__ == "__main__":
    sys.exit(main())
