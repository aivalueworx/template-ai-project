import http from "node:http";

const port = Number(process.env.PORT || 3001);

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hybrid AI Starter</title>
    <style>
      body { font-family: Inter, system-ui, sans-serif; padding: 32px; background: #f6f7fb; color: #111; }
      main { max-width: 860px; margin: 0 auto; background: #fff; border: 1px solid #dde2eb; border-radius: 20px; padding: 24px; }
      pre { background: #0d1117; color: #d7e3ff; padding: 16px; border-radius: 12px; }
    </style>
  </head>
  <body>
    <main>
      <h1>Hybrid AI starter</h1>
      <p>This placeholder web app exists so the repo has a visible front door immediately.</p>
      <pre id="out">Waiting...</pre>
      <script>
        fetch("http://localhost:3000/health")
          .then(r => r.json())
          .then(data => document.getElementById("out").textContent = JSON.stringify(data, null, 2))
          .catch(err => document.getElementById("out").textContent = String(err));
      </script>
    </main>
  </body>
</html>`;

http.createServer((_, res) => {
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.end(html);
}).listen(port, () => {
  console.log(`Web placeholder listening on :${port}`);
});
