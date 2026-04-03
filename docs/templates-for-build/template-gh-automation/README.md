# template-gh-automation

Starter repository for repo-triggered automation.

## Best fit
- CI/CD
- scheduled reports
- repo maintenance
- prompt evals
- artifact generation
- release packaging

## Includes
- reusable test and build workflows
- CI workflow that calls reusable workflows
- scheduled workflow for reports or automation
- placeholder release packaging workflow
- runbooks for secrets, rollback, and operations

## Quick start
1. Copy `.env.example` if your scripts need local variables.
2. Replace the placeholder scripts in `/scripts`.
3. Rename the workflow files only if needed.
4. Add any required GitHub Secrets described in `docs/SECRETS.md`.
