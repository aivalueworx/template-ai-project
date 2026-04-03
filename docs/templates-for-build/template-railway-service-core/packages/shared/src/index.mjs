export function sharedHealthPayload(service) {
  return {
    ok: true,
    service,
    now: new Date().toISOString()
  };
}
