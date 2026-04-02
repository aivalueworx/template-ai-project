---
Last reviewed: 2026-04-02
Owner: Backend Engineering
---

# Runbook: JWT Secret Rotation

## Triggers

- Quarterly rotation schedule (first Monday of Jan, Apr, Jul, Oct)
- Security incident involving suspected JWT secret compromise
- PagerDuty alert: `jwt-secret-age-exceeded-90-days`

## Pre-conditions

- [ ] Access to Railway dashboard for the `orderflow-api` service
- [ ] Access to GitHub repository secrets settings (`acme-corp/orderflow-api`)
- [ ] At least one other engineer on standby during the rotation (rotation causes a brief re-auth storm)
- [ ] Notify `#eng-backend` of planned rotation 30 minutes before starting

## Steps

1. **Generate a new secret**
   - Action: `openssl rand -base64 64`
   - Rationale: 64-byte base64 string gives sufficient entropy; shorter secrets are a documented vulnerability in JWT libraries
   - Validation: Output should be ~88 characters of base64 text

2. **Stage the new secret in Railway (do NOT apply yet)**
   - Action: Railway dashboard → `orderflow-api` → Variables → Add `JWT_SECRET_NEXT` with the new value
   - Rationale: We stage first so we can verify the value is correct before cutting over
   - Validation: Variable appears in Railway UI; do not redeploy yet

3. **Update application to accept both old and new secrets (dual-accept window)**
   - Action: Deploy a version of the app that verifies tokens with both `JWT_SECRET` and `JWT_SECRET_NEXT`
   - Rationale: Existing logged-in users have tokens signed with the old secret; we can't invalidate them instantly without logging everyone out
   - Validation: Deploy succeeds; existing test tokens (from staging) still work

4. **Promote `JWT_SECRET_NEXT` to `JWT_SECRET`**
   - Action: Railway → rename `JWT_SECRET_NEXT` → `JWT_SECRET`; remove the old value; redeploy
   - Rationale: All new tokens are now signed with the new secret
   - Validation: `curl https://api.acme-corp.com/v1/health` returns 200; issue a new test token and verify it's accepted

5. **Remove dual-accept mode**
   - Action: Deploy the standard single-secret JWT verification
   - Rationale: Old tokens are now expired (15-min TTL) or refreshed with new secret
   - Validation: Old test token from step 3 is now rejected with 401

6. **Update GitHub Actions secrets**
   - Action: GitHub repo → Settings → Secrets → Update `JWT_SECRET` for integration test workflow
   - Rationale: CI uses this secret for integration tests that issue tokens
   - Validation: CI run on a PR passes integration tests

7. **Document the rotation**
   - Action: Add entry to DECISIONS.md: `[YYYY-MM-DD] JWT secret rotated — quarterly schedule`
   - Rationale: Audit trail
   - Validation: DECISIONS.md committed and pushed

## Expected Outcome

All new JWT tokens are signed with the new secret. Existing logged-in users are seamlessly
re-authenticated via refresh tokens during the 15-minute dual-accept window. No user-visible
impact (zero 401 errors in Datadog during rotation).

## Rollback

If issues arise after step 4:
1. Re-add the old `JWT_SECRET` value (keep it in a secure note for 24 hours post-rotation)
2. Redeploy
3. All new tokens will use the old secret again
4. Investigate the issue before retrying rotation

## Escalation

- Primary: James Okafor — `@james` on Slack / PagerDuty
- Secondary: On-call engineer via PagerDuty schedule

## Owner

Backend Engineering — assigned to on-call engineer for the rotation week.

## Estimated Time

Baseline: 25 minutes (including 15-minute dual-accept window)

## Last Tested

Date: 2026-01-06 | Result: Successful — 0 user-visible errors
