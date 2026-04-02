---
Last reviewed: 2026-04-02
---

# Cursor Automations Setup Guide

> Wires up the 3 Cursor Automations that form the live review and sync layer.
> One-time setup per repo. Requires access to [cursor.com/automations](https://cursor.com/automations).

> ⚠️ **Known issue (April 2026):** Cursor Automations triggers may not fire reliably on
> organisation repos — works consistently on personal repos only. Monitor the Cursor changelog.

---

## Prerequisites

- Cursor Pro or Team plan
- GitHub repo connected to Cursor
- `GITHUB_TOKEN` or a PAT with `repo` scope added to Cursor Automations secrets

---

## Automation 1: PR Review (adversarial challenge on PR open)

**Trigger:** Pull request opened  
**What it does:** Runs Stage 4A + 4C from `CHALLENGE_PROMPTS.md` and posts findings as a PR comment.

### Setup Steps

1. Go to [cursor.com/automations](https://cursor.com/automations) → **New Automation**
2. **Name:** `PR Adversarial Review`
3. **Trigger:** `Pull request opened`
4. **Repository:** `[your-org]/[your-repo]`
5. **Instruction:**

```
Read CHALLENGE_PROMPTS.md from this repository.

A pull request has just been opened. Run the following review stages:

STAGE 4A — Senior Engineer Review Simulation:
[paste Stage 4A prompt from CHALLENGE_PROMPTS.md]

STAGE 4C — Observability & Debuggability Check:
[paste Stage 4C prompt from CHALLENGE_PROMPTS.md]

Changed files: {diff}

Post your findings as a structured PR comment with sections:
✅ What's done well | ❌ Must fix (blocking) | ⚠️ Should fix | 📄 Doc gaps
```

6. **Post output as:** PR comment
7. Save and enable.

---

## Automation 2: Doc Sync (post-merge to main)

**Trigger:** PR merged to main  
**What it does:** Syncs README + CHANGELOG, commits and pushes.

### Setup Steps

1. **New Automation** → **Name:** `Doc Sync on Merge`
2. **Trigger:** `Pull request merged` (base branch: `main`)
3. **Instruction:**

```
A PR was just merged to main. Run the doc-sync workflow:

1. Check git diff HEAD~1 for changed source files.
2. Update README.md if installation commands, config vars, or architecture changed.
   Do NOT modify <!-- HUMAN-AUTHORED --> sections.
3. Add a Keep-a-Changelog entry to CHANGELOG.md under [Unreleased].
4. Update DECISIONS.md if a new library or pattern was introduced.
5. Update the 'Last reviewed' date on any doc you modify.
6. Commit with: docs(sync): auto-sync README and CHANGELOG after merge
7. Push to main.
```

4. **Permissions:** write access to repo
5. Save and enable.

---

## Automation 3: Doc Staleness Issues (weekly cron)

**Trigger:** Weekly cron (Monday)  
**What it does:** Opens GitHub issues for docs not reviewed in 60 days.

### Setup Steps

1. **New Automation** → **Name:** `Weekly Doc Staleness Check`
2. **Trigger:** `Schedule` → `Every Monday at 09:00 UTC`
3. **Instruction:**

```
Run the documentation staleness check:

1. Run: python scripts/check_doc_freshness.py --threshold-days 60 --docs-dir docs/
2. For each file flagged as stale or missing a 'Last reviewed' date:
   - Open a GitHub issue titled: "[doc-stale] {filename} needs review"
   - Label: documentation, tech-debt-audit
   - Body: "File {filepath} has not been reviewed in over 60 days.
     Update the 'Last reviewed: YYYY-MM-DD' frontmatter after reviewing."
3. If no stale files: no action needed.
```

4. Save and enable.

---

## Verifying Automations Work

After setup:
1. Open a test PR → check that the PR Review automation posts a comment within 2 minutes.
2. Merge a small change → check that Doc Sync commits appear within 5 minutes.
3. Wait for Monday or trigger manually → check that staleness issues appear.

---

## Secrets Required

| Secret name | Value | Used by |
|---|---|---|
| `GITHUB_TOKEN` | Auto-provided by GitHub Actions | All workflows |
| `REPO_SYNC_PAT` | PAT with `repo` scope | `template-sync.yml` workflow |

Set secrets at: `GitHub repo → Settings → Secrets and variables → Actions`
