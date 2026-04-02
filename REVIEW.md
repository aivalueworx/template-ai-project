---
Last reviewed: REPLACE-WITH-DATE
Owner: Engineering Team
---

# REVIEW.md — Agent Stage-Gate Questions & Review Checklist

> Structured questions to ask Cursor/Claude agents at each development stage.
> Agents read this before any review step. Use the code-review skill to invoke automatically.
> Add project-specific checks in PROJECT-SPECIFIC sections.
> Never remove existing checks — only add.

---

## How to Use

**Manual:** Paste the phase header into Cursor chat:
> "Run the PHASE 1: PLAN REVIEW checks from REVIEW.md against this plan"

**Via Skill:** The `code-review` skill reads this file automatically.

**In CI:** `doc-staleness.yml` fails if Last reviewed date exceeds 90 days.

---

## PHASE 0: BRAINSTORM — Before Any Plan or Code

```
You are a critical product and architecture reviewer. Answer before we design anything:

PROBLEM CLARITY
- Restate the problem in one sentence without using "I"
- What does success look like, measurably?
- What is explicitly OUT OF SCOPE?

EXISTING SOLUTIONS
- Does this problem already have a solution in this codebase?
- Check docs/solutions/, DECISIONS.md, docs/adr/ — solved anything similar before?
- Would extending existing code be simpler than building new code?

HIDDEN COMPLEXITY
- What are the 3 most likely edge cases not yet considered?
- What happens with malformed, null, or adversarial input?
- What happens at 10x expected load?

DEPENDENCY RISK
- Does this require a new third-party library? Maintenance status, licence, last release?
- Does this touch shared/platform code used by other features?

REVERSIBILITY
- How easy is this to undo if it turns out to be the wrong approach?
- Does this introduce irreversible state (DB migrations, API contracts, data transforms)?
```

<!-- PROJECT-SPECIFIC BRAINSTORM QUESTIONS -->

---

## PHASE 1: PLAN REVIEW (Critic Gate) — After Plan, Before Code

```
You are a senior staff engineer. Rate findings: CRITICAL | HIGH | MEDIUM | LOW.

ARCHITECTURE FIT
- Does this plan follow patterns in CONVENTIONS.md?
- Does it introduce a new pattern conflicting with an existing one?
- Does it add abstraction where an existing one would suffice?
- Would a senior engineer in 6 months find this "obvious" or "surprising"?

SCOPE CREEP
- Does the plan solve more than stated in the PRD?
- Are components being built that could be deferred?
- Is anything "nice to have" rather than required by acceptance criteria?

BREAKING CHANGE DETECTION
- Does this change any public API, exported function signature, or data schema?
- If yes: migration strategy? All callers identified and accounted for?
- Does this remove, rename, or change behaviour of any existing capability?
- Will existing tests break? Should they, or is that a regression?

DATA & STATE RISKS
- Schema change? Migration with rollback?
- New shared mutable state introduced?
- Does the plan handle existing data that doesn't match the new schema?

MISSING PIECES
- What does this plan NOT cover that it should?
- Error handling specified for every failure mode?
- Testing approach and coverage targets specified?
- Observability/logging strategy for the new code path?

ASSUMPTION AUDIT
- List every assumption. Which are unverified?
- What would have to be true for this plan to fail completely?
```

<!-- PROJECT-SPECIFIC PLAN REVIEW QUESTIONS -->

---

## PHASE 2: PRE-CODING SAFETY CHECK — Before Agent Writes First Line

```
Before writing any code, answer:

SCOPE BOUNDARY
- List every file you intend to modify. Are any of them:
  a) In docs/adr/ or docs/postmortems/? → STOP — human-only
  b) Shared platform code used by other features?
  c) Test files you are considering modifying to make tests pass?
- If modifying shared code: all downstream consumers identified?

CONTEXT CHECK
- Run: git log --oneline -10 [relevant files]
- What was the last change to the files you are about to modify, and why?
- Is there an open PR or in-progress branch touching the same files?

SIDE EFFECT MAPPING
- All side effects of the changes you are about to make?
- Which are user-visible? Which are internal?
- Any side effects touching external services, queues, or databases?

ROLLBACK PLAN
- If this causes a production incident, what is the rollback procedure?
- Is this behind a feature flag? Should it be?
- Any irreversible writes or migrations in this change?
```

---

## PHASE 3: MID-IMPLEMENTATION CHECKPOINT — Every 30-60 Minutes

```
Pause and answer before continuing:

DRIFT CHECK
- Compare current implementation against PLAN.md. Still following the plan?
- If deviated: intentional? Does PLAN.md need updating?
- Any pattern introduced not in CONVENTIONS.md?

COMPLIANCE DRIFT CHECK (after any large change)
- Run: git diff --stat HEAD
- For each modified file: does it comply with relevant rules in .cursor/rules/ or .claude/rules/?
- Any violations of CONVENTIONS.md introduced by recent changes?

SILENT MODIFICATION DETECTION
- Modified any file NOT in the original scope list?
- If yes: why? Necessary? Documented?
- Changed any test to make it pass rather than fixing root cause?
  → This is the "AI rewrites the test" anti-pattern. Stop and fix the actual bug.

CONTEXT WINDOW HEALTH
- Has this session been running >60 minutes?
- If yes: stop, update HANDOFF.md, start a new session, reference HANDOFF.md and PLAN.md.
```

<!-- PROJECT-SPECIFIC MID-IMPLEMENTATION CHECKS -->

---

## PHASE 4: PRE-COMMIT REVIEW — Before Every Commit

```
Verify ALL before committing:

BUILD & TESTS
[ ] npm run build — zero errors
[ ] npm run typecheck — no TypeScript errors, no implicit any
[ ] npm test — ALL tests pass, not just changed-file tests
[ ] npm run lint — zero warnings in changed files

CORRECTNESS
[ ] Implementation matches every acceptance criterion in PRD.md
[ ] All edge cases from brainstorm phase handled
[ ] Every error path handled and tested
[ ] No TODO, FIXME, or console.log in production code paths

DOCUMENTATION
[ ] Every new exported function: TSDoc with @param @returns @throws @example
[ ] README.md updated if commands, config, or setup changed
[ ] openapi.yaml updated if route handlers changed
[ ] CHANGELOG.md updated
[ ] DECISIONS.md updated if new library or pattern introduced
[ ] ADR stub created if architecturally significant decision made

SECURITY
[ ] No secrets, tokens, or credentials committed
[ ] User inputs validated and sanitised
[ ] No SQL injection or XSS vectors
[ ] Authorization checks on new/modified endpoints

BREAKING CHANGES
[ ] No public API signatures changed without migration strategy
[ ] No exported types renamed/removed without versioning
[ ] No database schema changes without migration file
[ ] openapi.yaml: only error response additions, no removals
```

<!-- PROJECT-SPECIFIC PRE-COMMIT CHECKS -->

---

## PHASE 5: PRE-MERGE / PR REVIEW — Before Human Reviews PR

```
You are a senior engineer who has never seen this codebase. Read the full diff and answer:

ONE-SENTENCE SUMMARY
"This PR [does what] by [how], affecting [what systems]."

BREAKING CHANGE AUDIT
- Does this PR change any interface, schema, or contract visible outside this service?
- If yes: all consumers identified and updated/notified?
- Does this PR remove or deprecate any capability? Documented?

ARCHITECTURE COMPLIANCE
- Does this PR conflict with any ADR in docs/adr/?
- Does it introduce a pattern not in CONVENTIONS.md?
- Is complexity proportionate to the problem?

TEST COVERAGE
- Every new code path has a test?
- Tests test behaviour, not implementation details?
- Integration tests for any new service boundaries?

FAILURE MODE ANALYSIS
- What happens if this code fails at runtime?
- Failure mode: graceful (degraded) or hard (crash/data loss)?
- Alerting and observability for new failure paths?

SCOPE VIOLATION CHECK
- Any changes unrelated to the stated objective?
- Any "while I was here" refactors that should be a separate PR?

DOC COMPLETENESS
- All pre-commit doc checks resolved?
- HANDOFF.md updated?
- ADR stub flagged for human review before merge?
```

---

## PHASE 6: POST-MERGE COMPOUND — Before Starting Next Feature

```
Compound this feature's learnings before moving on.

LESSONS LEARNED
- What was harder than expected, and why?
- What plan assumption was wrong?
- What pattern worked well → add to CONVENTIONS.md?
- What anti-pattern was discovered → add to CONVENTIONS.md?

CREATE SOLUTION DOC at docs/solutions/[feature]-[YYYY-MM-DD].md:
- Problem: what was being solved
- Approach: what was built and why
- Key decisions: link to ADRs created
- Gotchas: what to watch out for when modifying this code
- Reusable patterns: what can be copied for similar problems

AGENT IMPROVEMENT
- Questions in REVIEW.md that should be updated?
- New checks that would have caught an issue earlier?
- AGENTS.md updates: new gotcha, constraint, or pattern?
- New Cursor Rule or Claude Skill to prevent a repeated mistake?

MEMORY UPDATE
Ask Claude: "Update .claude/memory/general.md with any new project-specific
facts, gotchas, or preferences learned during this feature."
```

<!-- PROJECT-SPECIFIC COMPOUND QUESTIONS -->

---

## SPECIAL INTERROGATIONS

### Breaking Change Detector
*Use when touching shared modules, data models, APIs, or platform code.*

```
Breaking change audit — answer before writing any code:

1. Run: grep -r "[symbol name]" src/ --include="*.ts" | head -50
   List every file that imports or uses what you are about to change.

2. For each caller:
   - Still compiles after your change?
   - Still behaves correctly at runtime?
   - Needs to be updated?

3. API contracts:
   - Compare current openapi.yaml entry against intended change.
   - Classify: Non-breaking (additive only) | Breaking (removal/rename/type change)
   - If breaking: versioning strategy?

4. Database schemas:
   - Migration file exists?
   - Migration has rollback (down migration)?
   - Existing data passes new constraints?
   - Foreign key or index implications?
```

### Architecture Drift Detector
*Use monthly, after large refactors, or when onboarding new engineers.*

```
Architecture compliance audit:

1. Read docs/adr/ — list all Accepted ADRs.
2. For each ADR: is the decision still followed in the codebase?
3. Read CONVENTIONS.md — scan src/ for top-5-rule violations.
4. Run: npx depcheck — unused dependencies?
5. Run: npx madge --circular src/ — circular dependencies?
6. List code patterns in src/ that contradict established architecture.
7. Rate each: CRITICAL | HIGH | MEDIUM | LOW
8. For each CRITICAL: create an issue or ADR stub.
```

### Silent Modification Detector
*Use after sessions >30 min or complex multi-file changes.*

```
Security-minded review of scope creep:

1. Run: git diff --name-only HEAD
   List every modified file.

2. For each file NOT in original scope:
   - Why was it modified?
   - Necessary for the stated task?
   - Correct and intentional?

3. For each test file modified:
   - Changed to make code pass, or was the test genuinely wrong?
   - Does the original test still represent correct expected behaviour?

4. For each config or infrastructure file modified:
   - What changed?
   - Could this affect other environments or services?
   - Runbook update needed?
```

### Context Window Reset Protocol
*Use when session has been running >60 minutes or context seems confused.*

```
Start a new session and paste:

"I am resuming work on [project]. Read these files in order before doing anything:
1. AGENTS.md
2. CONVENTIONS.md
3. HANDOFF.md
4. PLAN.md (if active)
5. TASKS.md (if active)

Then tell me: what was the last completed task, what is in progress,
and what is the recommended next action?"
```

### Multi-Model Verification
*Use for hard problems, security-sensitive code, or novel patterns.*

```
Run this same prompt across claude-sonnet, gpt-4-1, and gemini-2-pro simultaneously:

"Review [code/plan]. List:
1. Correctness issues (blocking)
2. Security concerns (blocking)
3. Architecture observations (non-blocking)
4. What the other models probably missed"

Compare outputs. Any issue flagged by 2+ models = CRITICAL. Fix before proceeding.
```
