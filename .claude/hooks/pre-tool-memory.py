#!/usr/bin/env python3
"""
Pre-tool memory injection hook for Claude Code.
Injects MEMORY.md and HANDOFF.md content at session start so the agent
always has cross-session context without being explicitly asked.

Registered in .claude/settings.json under hooks.PreTool.
Runs once per session (guards against repeated injections via a session flag).
"""

import os
import sys

SESSION_FLAG = "/tmp/.claude_memory_injected"

if os.path.exists(SESSION_FLAG):
    sys.exit(0)

files_to_inject = ["MEMORY.md", "HANDOFF.md"]
output_parts = []

for filepath in files_to_inject:
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            output_parts.append(f"=== {filepath} ===\n{content}")
        except Exception:
            pass

if output_parts:
    print("\n".join(output_parts))

# Mark as injected for this session
try:
    with open(SESSION_FLAG, "w") as f:
        f.write("1")
except Exception:
    pass
