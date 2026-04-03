export async function exampleTask(payload: { topic: string }) {
  return {
    ok: true,
    payload,
    next: "Replace this with your durable async workflow."
  };
}
