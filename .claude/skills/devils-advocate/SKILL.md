# Skill: devils-advocate

> Adversarial challenge review — forces the agent into a critical, skeptical mode.
> Uses CHALLENGE_PROMPTS.md Stage 1A or the stage appropriate to the current work.
> Invoke with: `/devils-advocate` or `@challenge` in Cursor

## Purpose

The same AI that writes the code should NOT be the only one reviewing it.
This skill forces a mode shift: from "how to build" to "whether to build" and
"what could go wrong" — before those things actually go wrong.

## Selecting the Right Stage

| Current activity | Stage to run |
|---|---|
| Reviewing a plan or PRD | Stage 1A (Devil's Advocate on the Plan) |
| Mid-implementation | Stage 2A (Mid-Session Drift Check) + 2C (Security Scan) |
| Before committing | Stage 3A (Pre-Commit Challenge) |
| Before opening PR | Stage 4A + 4B + 4C |
| API or schema change | Stage 4D (API Contract Check) |
| Post-sprint / pre-release | Stage 5A + 5C |

## Steps

1. Identify the current stage from the table above.
2. Read the full prompt from `CHALLENGE_PROMPTS.md` for that stage.
3. Switch into adversarial mode: your job is to find failure modes, NOT validate.
4. Output findings in the stage's specified format.
5. For each finding: classify as FATAL / WARN / INFO.
6. FATAL findings block progress — they must be resolved before continuing.
7. WARN findings should be addressed before PR.
8. INFO findings go into DECISIONS.md or HANDOFF.md.

## Cross-Model Review (Stage 6)

For maximum coverage on security-sensitive or architecturally significant changes:
- Run Stage 6A with a DIFFERENT model than wrote the code.
- A model will not reliably catch its own blind spots.
- Commit the adversarial review output to `docs/reviews/` before merging.
