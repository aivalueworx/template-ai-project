import { sharedHealthPayload } from "../../../packages/shared/src/index.mjs";

const intervalMs = Number(process.env.WORKER_POLL_INTERVAL_MS || 15000);

console.log("Worker started.", sharedHealthPayload("railway-worker"));

setInterval(() => {
  console.log("Worker tick", new Date().toISOString(), {
    next: "Replace this with queue polling, cron work, or background tasks."
  });
}, intervalMs);
