/**
 * Runs once when the server boots (Next.js instrumentation hook).
 *
 * SECURITY: required secrets are validated here so the process refuses to
 * start when something is missing, instead of falling back to a default or
 * failing later on a random request.
 */
export async function register() {
  const { databaseUrl, authPassword, sessionSecret } = await import("./lib/env");
  databaseUrl();
  authPassword();
  sessionSecret();
  console.log("Bug Tracker: environment OK, listening on 127.0.0.1 only.");
}
