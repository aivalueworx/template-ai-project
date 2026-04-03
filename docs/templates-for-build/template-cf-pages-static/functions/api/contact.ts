type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

export const onRequestPost: PagesFunction<{
  CONTACT_EMAIL: string;
}> = async (context) => {
  const body = (await context.request.json()) as ContactPayload;

  return Response.json({
    ok: true,
    received: body,
    next: "Replace this handler with your CRM, email, or database integration.",
    routedTo: context.env.CONTACT_EMAIL || "unset"
  });
};
