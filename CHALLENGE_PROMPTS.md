---
Last reviewed: 2026-04-02
Owner: Engineering Team
---

# CHALLENGE_PROMPTS.md

> A library of structured adversarial prompts for each stage of development.
> Reference in Cursor chat as `@CHALLENGE_PROMPTS.md` or Claude Code as `/challenge`.
> Purpose: surface bad architecture, conflicts, breaking changes, security issues, and
> over-engineering BEFORE they reach production.
> 
> Philosophy: the same AI that writes the code should NOT be the only one reviewing it.
> Use these prompts to force the agent into a different, critical thinking mode.

---

## How to Use

- **In Cursor**: type `@CHALLENGE_PROMPTS.md` then paste the relevant prompt block
- **In Claude Code**: invoke via `/devils-advocate` skill or paste the prompt directly
- **In CI**: the `REVIEW_GATE.md` skill runs Stage 4 and 5 prompts automatically pre-merge
- **Cross-model review**: run Stage 3–5 prompts with a *different* model to the one that wrote the code — a model won't catch its own blind spots[cite:205]

---

## Stage 1: Before Writing Any Code (Planning Gate)

Use before starting a feature. Forces the agent out of "how to build" mode into "whether to build" mode.[cite:197]

### 1A — Devil's Advocate on the Plan

```
You are a highly skeptical senior engineer reviewing a proposed plan.
Your job is NOT to help implement this — your job is to find every reason it might fail.

Plan/feature description: [paste PLAN.md or feature description]

Analyse this plan and produce:

1. FATAL FLAWS — reasons this plan cannot work as described
2. HIDDEN ASSUMPTIONS — things the plan assumes are true that may not be
3. ARCHITECTURAL CONFLICTS — ways this conflicts with existing patterns in the codebase (reference CONVENTIONS.md and DECISIONS.md)
4. SCOPE CREEP RISKS — parts of this plan that will silently expand during implementation
5. STRESS-TEST QUESTIONS — 3 questions that, if we can't answer them, we should not proceed

Be relentlessly objective. Do not validate. Do not soften criticism.
```

### 1B — Architecture Fit Check

```
Before we build [feature], check the following:

1. Does this require new dependencies? If so, are there existing packages in package.json that already solve this?
2. Does this pattern exist elsewhere in src/? Would adding it again create duplication?
3. Will this require changes to the database schema? If so, what migrations are needed and what is the rollback strategy?
4. Does this touch any shared utilities, auth, or middleware that could affect other features?
5. What is the blast radius if this breaks in production?

Reference: DECISIONS.md, CONVENTIONS.md, openapi.yaml, and the existing src/ structure.
Output: a table with YES/NO answers and a recommended proceed/pause/redesign decision.
```

### 1C — Complexity Budget Check

```
Evaluate the proposed implementation complexity for [feature]:

1. LINES OF CODE estimate — is this proportionate to the value delivered?
2. NEW ABSTRACTIONS — does this introduce new patterns, base classes, or shared utilities that will need to be maintained?
3. DEPENDENCIES — list every new npm/pip package required. For each: stars, last commit date, licence, known vulnerabilities.
4. COGNITIVE LOAD — will a new engineer understand this in under 10 minutes?
5. OVER-ENGINEERING RISK — is there a simpler solution that achieves 80% of the value with 20% of the complexity?

Recommend: proceed as-is / simplify first / spike needed
```

---

## Stage 2: During Implementation (Mid-Session Checkpoint)

Use after every major unit of work — before moving to the next. Catches drift before it compounds.[cite:189][cite:200]

### 2A — Mid-Session Drift Check

```
Review what has been built so far in this session against the original PLAN.md.

1. SCOPE DRIFT — has the implementation added anything not in the plan?
2. CONVENTION VIOLATIONS — does any new code violate rules in CONVENTIONS.md?
3. PARTIAL IMPLEMENTATIONS — are there any half-finished changes that could leave the codebase in a broken state if this session ends now?
4. UNEXPECTED DEPENDENCIES — did any new imports or packages appear that weren't planned?
5. TEST COVERAGE — are the changes testable as-is? What is currently untested?

Output: traffic-light status (🟢 / 🟡 / 🔴) per item, with specific file:line references.
```

### 2B — Breaking Change Scanner

```
Scan all files modified in this session for breaking changes.

A breaking change is any modification that could affect:
- Existing API consumers (changed endpoint paths, methods, parameter names, response shapes)
- Database consumers (column renames, type changes, removed columns, new NOT NULL fields without defaults)
- Other modules in src/ (renamed exports, changed function signatures, removed functions)
- Environment setup (new required env vars without defaults)
- Build or deploy process (new required tools, changed scripts)

For each breaking change found:
1. File and line number
2. What changed
3. What breaks
4. Migration strategy (how to update consumers)
5. Whether this needs a major version bump
```

### 2C — Security Scan

```
Review the code written in this session for security issues.

Check specifically for:
1. INPUT VALIDATION — are all user inputs validated and sanitised before use?
2. AUTHENTICATION — are new endpoints protected? Is auth checked at the right layer?
3. AUTHORISATION — are permission checks present? Can a user access another user's data?
4. INJECTION RISKS — SQL, NoSQL, shell command, or template injection vulnerabilities
5. SECRETS — any hardcoded credentials, API keys, or connection strings?
6. DEPENDENCY RISKS — any new packages with known CVEs or suspicious provenance?
7. ERROR MESSAGES — do error responses leak internal stack traces, file paths, or system info?

Output: CRITICAL (block merge) / WARN (fix before release) / INFO (document and monitor)
```

---

## Stage 3: Pre-Commit (Local Gate)

Run before `git commit`. Fast, focused checks that catch the most common issues.[cite:204][cite:206]

### 3A — Pre-Commit Challenge

```
Before I commit these changes, challenge them:

Changed files: [paste `git diff --name-only`]

1. Does the commit message accurately describe what changed? (conventional commit format)
2. Are there any debug statements, console.logs, or TODO comments that shouldn't be committed?
3. Is there any dead code — unreachable paths, unused imports, commented-out blocks?
4. Are all new functions exported from the right place in the module boundary?
5. Has any configuration file changed that could affect other developers' local setup?
6. Is there anything in this diff that future-me will regret in 6 months?

Output: GO (commit) / STOP (fix first: [reason])
```

### 3B — Type Safety Check

```
Review the TypeScript in this diff for type safety issues:

1. Any use of `any` type? If so, is there a typed alternative?
2. Any non-null assertions (`!`) without an explanatory comment?
3. Any `as` type casts that bypass the type system?
4. Any function parameters that accept `unknown` but don't have type guards?
5. Are all async functions properly awaited?
6. Are all Promise rejections handled?

Output: list of violations with file:line and suggested fix.
```

---

## Stage 4: Pre-PR / Pre-Review (Quality Gate)

Run before opening a pull request. The most comprehensive challenge layer.[cite:182][cite:191]

### 4A — Senior Engineer Review Simulation

```
You are a senior engineer who has been maintaining this codebase for 2 years.
You have deep knowledge of why certain patterns exist (see DECISIONS.md and docs/adr/).
You are reviewing this PR with the following mindset:

"I need to understand what this does, why it was done this way, and whether
 I'll regret merging this in 6 months."

Changed files: [paste diff or file list]

Provide a structured review:

## ✅ What's done well
[Acknowledge good decisions — be specific]

## ❌ Must fix before merge (blocking)
[Issues that would cause bugs, security problems, or maintainability nightmares]

## ⚠️ Should fix (non-blocking but important)
[Things that will accumulate as tech debt if ignored]

## 📄 Doc gaps
[Missing or outdated documentation — docstrings, README, openapi.yaml, ADRs]

## 🧠 Tribal knowledge risk
[Anything that only makes sense if you know context NOT captured in docs]
Does any of this logic need to be in DECISIONS.md or an ADR?
```

### 4B — Architecture Regression Check

```
This PR modifies [list of key files/modules].

Check for architectural regressions:

1. LAYER VIOLATIONS — does any code call across architectural layers incorrectly?
   (e.g. UI component importing directly from database layer, controller importing from another controller)
2. CIRCULAR DEPENDENCIES — do any new imports create circular dependency chains?
3. PATTERN CONSISTENCY — does the implementation follow the same patterns as similar features?
   (Reference: existing patterns in src/)
4. COUPLING INCREASE — has this change made two modules more tightly coupled?
   Could a future change to module A now silently break module B?
5. ABSTRACTION LEAKAGE — is any internal implementation detail exposed in a public interface?

Output: violations with specific file:line references and refactoring suggestions.
```

### 4C — Observability & Debuggability Check

```
Review this PR for production observability:

1. LOGGING — are new error paths logged with sufficient context to debug in production?
2. ERROR PROPAGATION — do errors include enough context to trace back to root cause?
3. METRICS — if this handles significant business logic, are there metrics or traces?
4. FEATURE FLAGS — should this be behind a feature flag for safe rollout?
5. ROLLBACK — if this causes a production incident, what does the rollback procedure look like?
   (If no runbook exists, create a stub at docs/runbooks/)
6. ALERT THRESHOLD — will existing alerts catch regressions introduced by this change?

Output: traffic-light per item + specific recommendations.
```

### 4D — API Contract Check

```
This PR changes [API endpoints / data schemas / function signatures].

Verify API contract integrity:

1. BACKWARD COMPATIBILITY — can existing clients still call these endpoints without changes?
2. FORWARD COMPATIBILITY — will a future extension of this API require breaking changes?
3. OPENAPI SYNC — does openapi.yaml accurately reflect the current implementation?
4. ERROR CONTRACT — are all possible error states documented with codes and messages?
5. VERSIONING — should this change increment the API version?
6. CONSUMER IMPACT — list every known consumer of this API and assess whether they are affected.
```

---

## Stage 5: Post-Merge / Periodic Audit

Use after a sprint or before a major release to catch accumulated drift.[cite:190]

### 5A — Technical Debt Audit

```
Audit the codebase for accumulated technical debt.

Focus areas:
1. STALE DEPENDENCIES — packages not updated in >6 months with available updates
2. PATTERN INCONSISTENCY — similar features implemented in different ways across the codebase
3. DEAD CODE — functions, modules, or routes that are no longer called
4. OVER-ENGINEERED ABSTRACTIONS — generalised patterns built for flexibility that is never used
5. TEST DEBT — modules with <60% coverage or no tests at all
6. DOC DEBT — exported functions without docstrings, routes without openapi spec entries
7. ADR DEBT — architectural decisions made without a corresponding ADR

For each item: severity (HIGH/MEDIUM/LOW), effort to fix (hours), and risk of ignoring.
Output as a prioritised backlog.
```

### 5B — Cross-Cutting Concerns Audit

```
Review the codebase for cross-cutting concern consistency:

1. ERROR HANDLING — is there a consistent error handling pattern, or does every module do it differently?
2. LOGGING — is there a consistent logging format and level usage?
3. VALIDATION — is input validation happening at the right layer, consistently?
4. AUTH — is authentication/authorisation checked at the same architectural layer everywhere?
5. CONFIG — are environment variables accessed consistently (one place, typed, validated at startup)?
6. TESTING PATTERNS — are tests written consistently across the codebase?

For each inconsistency: describe the current state, the ideal pattern, and the migration path.
```

### 5C — "Future Engineer" Test

```
Imagine a senior engineer joins the team tomorrow with no prior context.
They clone this repo and have 30 minutes to understand it well enough to make a safe change.

Review the current state of:
- README.md
- AGENTS.md
- CONVENTIONS.md
- DECISIONS.md
- docs/adr/
- Docstrings on the 5 most complex modules

Answer:
1. What would they understand correctly?
2. What would they misunderstand?
3. What tribal knowledge is NOT in any document that would cause them to make a breaking change?
4. What is the most dangerous thing they could do if left alone for a day?

Output: ranked list of documentation and knowledge gaps to close.
```

---

## Stage 6: Agent-to-Agent Adversarial Review

For teams running multi-model pipelines or cross-agent review.[cite:205][cite:207]

### 6A — Cross-Model Review Prompt (send to a DIFFERENT model)

```
You are reviewing code written by a different AI model that had the following context:
[paste summary of what was built and why]

You have NOT seen the original conversation or reasoning chain.
Your job is to find what the original model missed — not to validate its work.

Review the following diff/files:
[paste code]

Focus on:
1. Decisions that seem arbitrary — why this approach and not an obvious alternative?
2. Edge cases the implementation doesn't handle
3. Assumptions baked into the code that may not hold in production
4. Security or performance issues that look correct but aren't

The original model thought this was good. Prove it wrong where you can.
```

### 6B — Gap Analysis Prompt

```
Perform a gap analysis on this implementation against the original specification.

Specification (PRD.md / PLAN.md / ticket):
[paste spec]

Implementation:
[paste code or file list]

Identify:
1. Requirements in the spec NOT reflected in the implementation
2. Implementation details NOT covered by the spec (scope creep or undocumented decisions)
3. Acceptance criteria from the spec that cannot be verified from the code alone
4. Ambiguities in the spec that the implementation resolved — were they resolved correctly?

Output: a gap table with status (IMPLEMENTED / MISSING / AMBIGUOUS / ADDED) per requirement.
```

---

## Quick Reference Card

| When | Prompt to use | Where to run |
|---|---|---|
| Before starting a feature | 1A Devil's Advocate, 1B Architecture Fit | Cursor chat / Claude Code |
| Mid-implementation checkpoint | 2A Drift Check, 2B Breaking Change Scanner | Cursor chat |
| Before `git commit` | 3A Pre-Commit Challenge | @committer skill or manual |
| Before opening PR | 4A Senior Review, 4B Architecture Regression, 4C Observability | Cursor Automation / manual |
| API or contract changes | 4D API Contract Check | Manual |
| After sprint / pre-release | 5A Tech Debt Audit, 5C Future Engineer Test | Scheduled Claude Code session |
| Multi-agent pipeline | 6A Cross-Model Review, 6B Gap Analysis | Different model than author |
