import { runExampleSkill } from "../../skills/src/index.mjs";
import { defaultPrompt } from "../../prompts/src/index.mjs";
import { validateAgentOutput } from "../../contracts/src/index.mjs";

export async function runAgent(input = {}) {
  const skillResult = await runExampleSkill({ input });
  const output = {
    ok: true,
    promptUsed: defaultPrompt,
    skillResult,
    answer: "Replace this placeholder with your real agent orchestration."
  };

  return validateAgentOutput(output);
}
