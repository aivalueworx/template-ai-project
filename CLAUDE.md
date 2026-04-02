# CLAUDE.md

@AGENTS.md

<!-- Claude Code reads @references inline — AGENTS.md is the canonical context source.
     Add Claude-specific overrides below only if they differ from AGENTS.md. -->

## Claude Code Skills

Available skills in `.claude/skills/`:
- `doc-sync` — sync documentation after code changes, commit, and push
- `adr-stub` — create an ADR stub when a significant decision is made
- `code-review` — structured code review with doc gap detection
- `commit-push` — conventional commit + push to current branch

Invoke with: `/skill-name` or describe the task and Claude will auto-select.

## Claude Code Rules

Path-scoped rules in `.claude/rules/`:
- `api.md` — activates for `src/routes/**`, `src/controllers/**`
- `tests.md` — activates for `**/*.test.ts`, `**/*.spec.ts`

## Memory

Run `/memory` to view all loaded context files.
Memory index: MEMORY.md
Auto-memory: on (Claude saves corrections and preferences automatically)

## Session End Protocol

At the end of every session, update HANDOFF.md with:
1. What was completed
2. What is in progress (with file paths)
3. What is blocked and why
4. Next recommended action
