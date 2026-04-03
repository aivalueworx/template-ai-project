export class SessionRoom extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.endsWith("/state")) {
      const state = await this.ctx.storage.get("state");
      return Response.json({ ok: true, state: state || {} });
    }

    if (request.method === "POST" && url.pathname.endsWith("/state")) {
      const body = await request.json();
      await this.ctx.storage.put("state", body);
      return Response.json({ ok: true, saved: true });
    }

    return Response.json({ ok: true, note: "Durable Object placeholder." });
  }
}
