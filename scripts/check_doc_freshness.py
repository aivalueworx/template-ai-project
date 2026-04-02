#!/usr/bin/env python3
"""
Checks documentation files for a 'Last reviewed: YYYY-MM-DD' front matter field.
Fails (exit 1) if any file hasn't been reviewed within --threshold-days.
Skips: docs/adr/, docs/postmortems/ (human-only, exempt from expiry).
"""

import os
import re
import sys
import argparse
from datetime import datetime, timedelta

EXEMPT_DIRS = ["adr", "postmortems"]
DATE_PATTERN = re.compile(r"Last reviewed:\s*(\d{4}-\d{2}-\d{2})", re.IGNORECASE)
MISSING_DATE_PATTERN = re.compile(r"\.md$")


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--threshold-days", type=int, default=90)
    parser.add_argument("--docs-dir", default="docs/")
    parser.add_argument("--fail-on-stale", action="store_true")
    return parser.parse_args()


def is_exempt(filepath: str) -> bool:
    parts = filepath.replace("\\", "/").split("/")
    return any(exempt in parts for exempt in EXEMPT_DIRS)


def check_file(filepath: str, threshold: timedelta) -> tuple[bool, str]:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read(2000)  # Only read front matter area

    match = DATE_PATTERN.search(content)
    if not match:
        return False, f"MISSING 'Last reviewed' date"

    try:
        reviewed_date = datetime.strptime(match.group(1), "%Y-%m-%d")
    except ValueError:
        return False, f"INVALID date format: {match.group(1)}"

    age = datetime.now() - reviewed_date
    if age > threshold:
        return False, f"STALE — last reviewed {match.group(1)} ({age.days} days ago)"

    return True, f"OK — reviewed {match.group(1)}"


def main():
    args = parse_args()
    threshold = timedelta(days=args.threshold_days)
    stale_files = []
    checked = 0

    for root, dirs, files in os.walk(args.docs_dir):
        # Skip exempt directories in-place
        dirs[:] = [d for d in dirs if d not in EXEMPT_DIRS]
        for filename in files:
            if not filename.endswith(".md"):
                continue
            filepath = os.path.join(root, filename)
            if is_exempt(filepath):
                continue
            checked += 1
            ok, message = check_file(filepath, threshold)
            status = "✅" if ok else "❌"
            print(f"{status} {filepath}: {message}")
            if not ok:
                stale_files.append(filepath)

    print(f"\n{'='*60}")
    print(f"Checked {checked} files | Threshold: {args.threshold_days} days")
    print(f"Stale or missing dates: {len(stale_files)}")

    if stale_files and args.fail_on_stale:
        print("\n❌ Failing build — update 'Last reviewed' dates or add them.")
        sys.exit(1)
    elif stale_files:
        print("\n⚠️  Stale docs found (not failing build — --fail-on-stale not set).")
    else:
        print("\n✅ All documentation is within freshness threshold.")


if __name__ == "__main__":
    main()
