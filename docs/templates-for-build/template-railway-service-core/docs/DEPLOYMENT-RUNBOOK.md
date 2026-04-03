# DEPLOYMENT-RUNBOOK.md

## Service layout
- `apps/api` -> public API service
- `apps/worker` -> private background worker

## Railway setup
1. Create a project.
2. Create an empty service for the API.
3. Create an empty service for the worker.
4. Point each service at the corresponding subdirectory config file.
5. Enable Wait for CI if you deploy from GitHub integration.

## Persistence
If the app needs persisted files, add a Railway volume.
