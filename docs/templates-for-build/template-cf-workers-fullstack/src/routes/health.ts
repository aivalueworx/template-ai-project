import { json } from "../lib/json";

export function handleHealthRoute() {
  return json({
    ok: true,
    now: new Date().toISOString()
  });
}
