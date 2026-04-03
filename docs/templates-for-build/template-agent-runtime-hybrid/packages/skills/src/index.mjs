export async function runExampleSkill(payload = {}) {
  return {
    ok: true,
    payload,
    skill: "example-skill"
  };
}
