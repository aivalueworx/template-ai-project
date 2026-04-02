# AI-Assisted Project Documentation Template (v3)

> A GitHub template repo implementing the full compound engineering documentation stack.
> Pre-wired with everything an AI-assisted development project needs to avoid the
> documentation debt and hallucination traps that break scaled projects.
>
> Based on research spanning: Cursor best practices, Claude Code architecture, Simon Willison's
> documentation toolchain, the compound engineering pattern, agent contract frameworks (arXiv 2026),
> MCP inter-agent protocols, and adversarial AI review methods.

---

## Why This Exists

AI coding tools (Cursor, Claude Code, GitHub Copilot) generate plausible-looking documentation
that silently decays, loses context at scale, and actively destroys developer trust once teams
discover a few false entries. This template treats documentation as code:

- **Version-controlled** — all context files live in the repo and are pushed to GitHub
- **Layered** — eight distinct doc layers, each with a clear owner and purpose
- **Compounding** — each session feeds learnings back into context files, making the next session smarter
- **Protected** — human-authored files (ADRs, postmortems, agent contracts) are CODEOWNERS-locked
- **Challenged** — adversarial review prompts surface bad architecture before it merges

---

## Quick Start

```bash
# 1. Use this as a GitHub template
#    GitHub → Use this template → Create new repository

# 2. Clone and open
git clone https://github.com/YOUR-ORG/YOUR-REPO
cursor .   # or: claude (Claude Code CLI)

# 3. Fill in human-authored sections (search for REPLACE-WITH and <!-- HUMAN-AUTHORED -->)
#    Key files to personalise: AGENTS.md, CONVENTIONS.md, DECISIONS.md

# 4. Set up Cursor Automations → see docs/cursor-automations-setup.md

# 5. Install the Willison toolchain (optional but recommended)
pip install llm
uvx install datasette
uvx install claude-code-transcripts
uvx install files-to-prompt

# 6. Push — GitHub Actions wire up automatically
git push origin main
```

---

## Documentation Layer Map

### Layer 1 — Code-Level (AI-assisted with caution)
| File/Location | Purpose | AI-safe? |
|---|---|---|
| Inline comments | Explain non-obvious logic | ⚠️ Verify each |
| Docstrings / TSDoc | Function-level contracts | ⚠️ Verify each |

### Layer 2 — System-Level (AI can scaffold, human reviews)
| File | Purpose |
|---|---|
| `README.md` | Project overview, setup, architecture summary |
| `docs/templates/openapi.yaml` | API reference (OpenAPI 3.1) |
| `docs/templates/ONBOARDING.md` | New engineer setup guide |

### Layer 3 — Operational (AI scaffolds runbook stubs, human fills)
| File | Purpose |
|---|---|
| `docs/runbooks/` | Step-by-step operational procedures |
| `docs/postmortems/` | Blameless incident retrospectives (HUMAN-ONLY) |
| `CHANGELOG.md` | Auto-updated by readme-sync workflow |

### Layer 4 — Process / Decision (HUMAN-ONLY — CODEOWNERS protected)
| File | Purpose |
|---|---|
| `docs/adr/` | Architecture Decision Records (immutable once Accepted) |
| `DECISIONS.md` | Lightweight decision log + ADR index |

### Layer 5 — AI Context / Memory (version-controlled, agent-maintained)
| File | Read by | Purpose |
|---|---|---|
| `AGENTS.md` | Cursor, Codex, OpenCode, all agents | Canonical project context |
| `CLAUDE.md` | Claude Code | Entry point → @AGENTS.md |
| `CONVENTIONS.md` | All agents | Coding standards, naming, testing |
| `DECISIONS.md` | All agents | Key decisions + ADR links |
| `HANDOFF.md` | All agents | Cross-session task state (update at session end) |
| `MEMORY.md` | Claude Code | Index of .claude/memory/ files |
| `TRANSCRIPT_LOG.md` | Humans | Index of session transcripts → GitHub Gists |

### Layer 6 — Agentic Workflow (agent-generated, human-reviewed)
| Template | When to create |
|---|---|
| `docs/agentic-workflow/PRD-TEMPLATE.md` | Before starting any significant feature |
| `docs/agentic-workflow/PLAN-TEMPLATE.md` | After PRD approved, before coding |
| `docs/agentic-workflow/TASKS-TEMPLATE.md` | During execution — agent ticks off tasks |
| `docs/agentic-workflow/SCRATCHPAD-TEMPLATE.md` | Active session working memory (gitignore or squash) |

### Layer 7 — Agent Governance (HUMAN-SPECIFIED — never auto-generated)
| File | Purpose |
|---|---|
| `docs/agent-governance/AGENT_CONTRACT-TEMPLATE.md` | Formal contract for each autonomous agent |
| `docs/agent-governance/TASK_CONTRACT-TEMPLATE.md` | Inter-agent delegation protocol (MCP TaskProposal spec) |
| `docs/agent-governance/TOOL_REGISTRY.md` | Registry of all MCP-callable tools with schemas |

### Layer 8 — Observability & Review
| File | Purpose |
|---|---|
| `docs/OBSERVABILITY.md` | What every agent invocation logs + retention policy |
| `CHALLENGE_PROMPTS.md` | Adversarial review prompts for every dev stage |
| `REVIEW_GATE.md` | Maps challenge prompts to CI/Automation triggers |

---

## File Tree

```
.
├── README.md                          ← This file
├── AGENTS.md                          ← Canonical AI context (fill before use)
├── CLAUDE.md                          ← Claude Code entry point
├── CONVENTIONS.md                     ← Coding standards (fill before use)
├── DECISIONS.md                       ← Decision log + ADR index
├── HANDOFF.md                         ← Cross-session task state
├── MEMORY.md                          ← Claude Code memory index
├── TRANSCRIPT_LOG.md                  ← AI session transcript index
├── CHALLENGE_PROMPTS.md               ← Adversarial review prompt library (6 stages)
├── REVIEW_GATE.md                     ← CI/Automation trigger map
├── REVIEW.md                          ← Agent stage-gate review checklist (6 phases)
├── CHANGELOG.md                       ← Auto-updated by readme-sync workflow
├── setup.sh                           ← One-command placeholder replacement on first clone
│
├── .claude/
│   ├── settings.json                  ← Model, permissions, hook registration
│   ├── rules/
│   │   ├── api.md                     ← Scoped rules for route handlers
│   │   └── tests.md                   ← Scoped rules for test files
│   ├── skills/
│   │   ├── doc-sync/SKILL.md          ← Sync docs + commit + push
│   │   ├── adr-stub/SKILL.md          ← Create ADR stubs (human fills)
│   │   ├── commit-push/SKILL.md       ← Conventional commit + push
│   │   ├── code-review/SKILL.md       ← Structured review with doc gap detection
│   │   └── devils-advocate/SKILL.md   ← Adversarial challenge review
│   ├── hooks/
│   │   └── pre-tool-memory.py         ← Injects MEMORY.md + HANDOFF.md at session start
│   └── memory/
│       └── general.md                 ← Cross-session preferences
│
├── .cursor/
│   └── rules/
│       ├── docs-readme.mdc            ← Auto-attaches to src/**, package.json
│       ├── docs-docstrings.mdc        ← Enforces TSDoc on exported functions
│       ├── docs-api.mdc               ← Syncs openapi.yaml when routes change
│       ├── docs-adr.mdc               ← Creates ADR stubs (never fills human sections)
│       ├── committer.mdc              ← @committer: conventional commit + push
│       └── challenge.mdc              ← @challenge: adversarial review at current stage
│
├── .github/
│   ├── CODEOWNERS                     ← Protects docs/adr/, postmortems/, AGENT_CONTRACT
│   ├── copilot-instructions.md        ← GitHub Copilot project context
│   └── workflows/
│       ├── api-docs.yml               ← Validate OpenAPI + deploy to GitHub Pages
│       ├── doc-staleness.yml          ← Block PRs if any doc >90 days stale
│       └── readme-sync.yml            ← Auto-sync README after merges
│
├── docs/
│   ├── cursor-automations-setup.md    ← Step-by-step Cursor Automations wiring guide
│   ├── OBSERVABILITY.md               ← Audit log spec + Willison toolchain notes
│   ├── agentic-workflow/
│   │   ├── PRD-TEMPLATE.md
│   │   ├── PLAN-TEMPLATE.md
│   │   ├── TASKS-TEMPLATE.md
│   │   └── SCRATCHPAD-TEMPLATE.md
│   ├── agent-governance/
│   │   ├── AGENT_CONTRACT-TEMPLATE.md
│   │   ├── TASK_CONTRACT-TEMPLATE.md
│   │   └── TOOL_REGISTRY.md
│   ├── templates/
│   │   ├── README-TEMPLATE.md
│   │   ├── RUNBOOK-TEMPLATE.md
│   │   ├── POSTMORTEM-TEMPLATE.md
│   │   └── openapi.yaml
│   └── adr/
│       └── 0001-record-architecture-decisions.md  ← First ADR (always ADR #1)
│
└── scripts/
    └── check_doc_freshness.py         ← Staleness checker (used by doc-staleness.yml)
```

---

## Human-Protected Sections

These files/sections must NEVER be auto-generated by AI:

- `docs/adr/` — every ADR's `Decision` and `Rationale` sections
- `docs/postmortems/` — entire file
- `docs/agent-governance/AGENT_CONTRACT-TEMPLATE.md` — Resource Constraints, Termination Conditions
- `<!-- HUMAN-AUTHORED -->` blocks in AGENTS.md, CONVENTIONS.md
- `DECISIONS.md` entries — AI can create stubs, human writes the decision

---

## The Willison Toolchain (AI Session Documentation)

Install these tools to capture and publish AI session history as first-class project artefacts:

```bash
# Log all LLM CLI interactions automatically to SQLite
pip install llm
llm logs path                                    # find your log database
datasette $(llm logs path)                       # browse as a web app

# Export Claude Code sessions to HTML and publish as GitHub Gists
uvx claude-code-transcripts --gist              # select session → publish to Gist
uvx claude-code-transcripts all -o docs/transcripts/   # archive all sessions

# Generate docs from code/tests
uvx files-to-prompt src/ -e ts -c | llm -m claude-3.7-sonnet -s 'architectural overview'
uvx files-to-prompt tests/ -e py -c | llm -m claude-3.7-sonnet -s 'write usage docs from tests'

# Log significant sessions in TRANSCRIPT_LOG.md
# Format: | Date | Commit SHA | Description | Gist Link |
```

Why this matters: AI session transcripts capture the *reasoning* behind commits —
the decisions made, alternatives rejected, and context that never makes it into code.
`TRANSCRIPT_LOG.md` is the index that connects conversations to commits.

---

## Cursor Automations Wiring (3 automations)

See `docs/cursor-automations-setup.md` for full instructions. Summary:

| Automation | Trigger | Action |
|---|---|---|
| PR Review | PR opened | Run CHALLENGE_PROMPTS Stage 4A + 4C, post findings as PR comment |
| Doc Sync | PR merged to main | Sync README + CHANGELOG, commit and push |
| Doc Staleness | Weekly cron (Monday) | Open GitHub issues for docs not reviewed in 60 days |

> ⚠️ Known issue (March 2026): Cursor Automations triggers may not fire reliably on
> organisation repos — works consistently on personal repos only.

---

## The Compound Engineering Loop

```
Session starts
    → pre-tool hook injects MEMORY.md + HANDOFF.md
    → agent reads AGENTS.md, CONVENTIONS.md, DECISIONS.md
    → agent builds feature using PRD → PLAN → TASKS flow
    → @challenge at key stages (Stages 1–4 of CHALLENGE_PROMPTS.md)
    → /doc-sync skill commits + pushes all doc updates
    → agent updates HANDOFF.md with session summary
    → significant sessions exported via claude-code-transcripts --gist
    → Gist link recorded in TRANSCRIPT_LOG.md
    → lessons learned fed back into CONVENTIONS.md / AGENTS.md
Session ends — next session starts smarter
```

---

## Placeholders to Replace

Search for these strings before first use:

- `REPLACE-WITH-DATE` — current date (YYYY-MM-DD)
- `[org]` / `your-org/engineering` — your GitHub organisation
- `<!-- HUMAN-AUTHORED -->` blocks — fill with project specifics
- `[YOUR-REPO]`, `[YOUR-ORG]` — repo and org names

---

*v3 — April 2026 | Built from compound engineering research, Cursor agent best practices,
Simon Willison's documentation toolchain, and the arXiv Agent Contracts framework.*
