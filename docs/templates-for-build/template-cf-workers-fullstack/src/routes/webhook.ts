import { json } from "../lib/json";
import type { Env } from "../index";

export async function handleWebhookRoute(request: Request, env: Env) {
  const secret = request.headers.get("x-shared-secret");
  const valid = secret && env.WEBHOOK_SHARED_SECRET && secret === env.WEBHOOK_SHARED_SECRET;

  return json({
    ok: !!valid,
    note: valid
      ? "Replace this with queue, workflow, or durable object handoff."
      : "Invalid or missing webhook secret."
  }, { status: valid ? 200 : 401 });
}
