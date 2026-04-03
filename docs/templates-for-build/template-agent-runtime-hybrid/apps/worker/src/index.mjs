import { runExampleSkill } from "../../../packages/skills/src/index.mjs";

const intervalMs = Number(process.env.WORKER_POLL_INTERVAL_MS || 10000);
console.log("Hybrid worker started.");

setInterval(async () => {
  const result = await runExampleSkill({ source: "worker-tick" });
  console.log("Hybrid worker tick", result);
}, intervalMs);
