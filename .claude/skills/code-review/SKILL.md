# Skill: code-review

> Structured code review with documentation gap detection.
> Uses REVIEW.md phase gates automatically.
> Invoke with: `/code-review` or "review this code/PR"

## What This Skill Does

Runs a multi-phase code review using the checklist in `REVIEW.md`, focusing on:
- Architecture compliance (CONVENTIONS.md + ADRs)
- Documentation gaps (missing docstrings, openapi.yaml drift, DECISIONS.md gaps)
- Security concerns
- Breaking change detection
- Tribal knowledge risk

## Steps

1. **Identify scope**
   ```bash
   git diff --name-only origin/main...HEAD
   ```
   Or review the files/diff provided by the user.

2. **Run Phase 4: Pre-Commit Review** from REVIEW.md — check all build/test/lint boxes.

3. **Run Phase 5: Pre-Merge/PR Review** from REVIEW.md.

4. **Apply Stage 4A** from CHALLENGE_PROMPTS.md (Senior Engineer Review Simulation).

5. **Check for doc gaps**:
   - Every new exported function has TSDoc (`@param`, `@returns`, `@throws`, `@example`)?
   - New route handlers have openapi.yaml entries?
   - New libraries or patterns added to DECISIONS.md?
   - ADR stub needed?

6. **Output a structured review**:

```markdown
## ✅ What's done well
[Be specific — acknowledge good decisions]

## ❌ Must fix before merge (blocking)
[Issues that cause bugs, security problems, or maintainability nightmares]
File: [file:line] — [issue] — [suggested fix]

## ⚠️ Should fix (non-blocking)
[Tech debt items]

## 📄 Doc gaps
[Missing or outdated documentation]

## 🧠 Tribal knowledge risk
[Context not captured in docs — should go in DECISIONS.md or an ADR]

## Verdict
GO / STOP (reason)
```
