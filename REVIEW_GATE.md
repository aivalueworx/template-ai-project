---
Last reviewed: REPLACE-WITH-DATE
---

# REVIEW_GATE.md

> Maps CHALLENGE_PROMPTS.md stages to automated CI/Cursor Automation triggers.
> Reference this file in Cursor Automations PR-opened instruction.

## Gate 1: Pre-Commit (local)
Trigger: git commit
Runs: CHALLENGE_PROMPTS.md Stage 3A (Pre-Commit Challenge)
Blocking: YES — fix before committing
Output: annotated commit message with issues found

## Gate 2: PR Opened (Cursor Automation / CI)
Trigger: GitHub PR opened event
Runs: CHALLENGE_PROMPTS.md Stage 4A + 4B + 4C
Blocking: posts review comments — human decides
Output: structured PR review comment

## Gate 3: API Contract Changed (CI)
Trigger: openapi.yaml modified in PR
Runs: CHALLENGE_PROMPTS.md Stage 4D (API Contract Check)
Blocking: YES — fails CI if backward compatibility broken without version bump
Output: ci-api-review.md artifact

## Gate 4: Pre-Release (scheduled weekly)
Trigger: manual or Monday cron
Runs: CHALLENGE_PROMPTS.md Stage 5A + 5C
Blocking: NO — creates prioritised GitHub issues labelled tech-debt-audit
Output: GitHub issues

## Gate 5: Cross-Model Adversarial Review (manual)
Trigger: significant architectural change or pre-v1 release
Runs: CHALLENGE_PROMPTS.md Stage 6A (send to DIFFERENT model than author)
Blocking: human decision
Output: adversarial review report committed to docs/reviews/
