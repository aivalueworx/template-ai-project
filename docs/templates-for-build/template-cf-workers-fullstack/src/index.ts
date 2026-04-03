import { json } from "./lib/json";
import { handleChatRoute } from "./routes/chat";
import { handleHealthRoute } from "./routes/health";
import { handleWebhookRoute } from "./routes/webhook";
import { SessionRoom } from "./durable-objects/SessionRoom";

export interface Env {
  OPENAI_API_KEY?: string;
  WEBHOOK_SHARED_SECRET?: string;
  SESSION_ROOM: DurableObjectNamespace<SessionRoom>;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return handleHealthRoute();
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      return handleChatRoute(request, env);
    }

    if (url.pathname === "/api/webhooks/example" && request.method === "POST") {
      return handleWebhookRoute(request, env);
    }

    return json(
      {
        ok: true,
        service: "cf-workers-fullstack",
        next: "Replace placeholder routes with your actual edge logic."
      },
      { status: 200 }
    );
  }
};

export { SessionRoom };
