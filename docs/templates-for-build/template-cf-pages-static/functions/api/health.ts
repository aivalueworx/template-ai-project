export const onRequestGet: PagesFunction = async () => {
  return Response.json({ ok: true, service: "pages-static", now: new Date().toISOString() });
};
