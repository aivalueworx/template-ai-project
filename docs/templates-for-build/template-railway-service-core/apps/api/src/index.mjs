import http from "node:http";
import { sharedHealthPayload } from "../../../packages/shared/src/index.mjs";

const port = Number(process.env.PORT || process.env.API_PORT || 3000);

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(sharedHealthPayload("railway-api")));
    return;
  }

  if (req.url === "/api/example") {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({
      ok: true,
      next: "Replace this route with your actual API."
    }));
    return;
  }

  res.statusCode = 404;
  res.end("Not found");
});

server.listen(port, () => {
  console.log(`API listening on :${port}`);
});
