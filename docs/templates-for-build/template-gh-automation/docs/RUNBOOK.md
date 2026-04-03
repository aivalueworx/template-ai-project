# RUNBOOK.md

## Primary use
This repo is for automation attached to GitHub events.

## Manual checks
- Confirm the workflows trigger on the right branches.
- Confirm reusable workflows are callable.
- Confirm required secrets exist.
- Confirm generated artifacts upload correctly.

## Failure response
- Re-run the failed workflow if the cause is transient.
- Revert the commit if the workflow failure is caused by code or config.
- Disable schedules temporarily if the automation is noisy.
