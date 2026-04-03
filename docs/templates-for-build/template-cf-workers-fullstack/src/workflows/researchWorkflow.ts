export type ResearchWorkflowInput = {
  topic: string;
};

export async function runResearchWorkflow(input: ResearchWorkflowInput) {
  return {
    ok: true,
    input,
    next: "Replace this with Cloudflare Workflows or hand off to a persistent backend."
  };
}
