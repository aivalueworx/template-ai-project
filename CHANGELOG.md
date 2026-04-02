# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

---

## [3.0.0] — 2026-04-02

### Added
- Complete AI-assisted documentation template stack (v3)
- AGENTS.md canonical AI context file (Cursor/Codex/OpenCode compatible)
- CLAUDE.md Claude Code entry point with @AGENTS.md reference
- CONVENTIONS.md coding standards and naming rules
- DECISIONS.md technical decisions log with ADR index
- HANDOFF.md cross-session task state for agent continuity
- MEMORY.md Claude Code memory index
- TRANSCRIPT_LOG.md AI session transcript index
- CHALLENGE_PROMPTS.md adversarial review library (6 stages, 15 prompts)
- REVIEW_GATE.md CI/Automation trigger map for challenge stages
- REVIEW.md structured agent stage-gate review checklist
- 5 Claude Code skills: doc-sync, adr-stub, commit-push, code-review, devils-advocate
- Pre-tool memory hook for session context injection
- 6 Cursor rules: docs-readme, docs-docstrings, docs-api, docs-adr, committer, challenge
- 4 GitHub Actions workflows: api-docs, doc-staleness, readme-sync, template-sync
- CODEOWNERS protection for ADRs, postmortems, and agent governance files
- GitHub Copilot instructions file
- Agentic workflow templates: PRD, PLAN, TASKS, SCRATCHPAD
- Agent governance templates: AGENT_CONTRACT, TASK_CONTRACT, TOOL_REGISTRY
- docs/OBSERVABILITY.md with Willison toolchain wiring
- docs/cursor-automations-setup.md — step-by-step Cursor Automations guide
- docs/adr/0001-record-architecture-decisions.md — first ADR (always ADR #1)
- docs/templates: README, RUNBOOK, POSTMORTEM templates and OpenAPI 3.1 skeleton
- scripts/check_doc_freshness.py — staleness checker used by CI gate
- setup.sh — one-command placeholder replacement on first clone
