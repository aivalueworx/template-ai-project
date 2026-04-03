import http from "node:http";
import { runAgent } from "../../../packages/agents/src/index.mjs";
import { sharedHealthPayload } from "../../../packages/shared/src/index.mjs";

const port = Number(process.env.PORT || 3000);

const server = http.createServer(async (req, res) => {
  if (req.url === "/health") {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(sharedHealthPayload("hybrid-api")));
    return;
  }

  if (req.url === "/api/agent" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const input = body ? JSON.parse(body) : {};
      const result = await runAgent(input);
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify(result));
    });
    return;
  }

  res.statusCode = 404;
  res.end("Not found");
});

server.listen(port, () => console.log(`Hybrid API listening on :${port}`));
