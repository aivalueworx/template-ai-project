import { json } from "../lib/json";
import type { Env } from "../index";

export async function handleChatRoute(request: Request, env: Env) {
  const payload = await request.json();

  return json({
    ok: true,
    mode: "placeholder",
    received: payload,
    edgeSuitable: true,
    note: env.OPENAI_API_KEY
      ? "Wire your actual model call here."
      : "OPENAI_API_KEY is not set."
  });
}
