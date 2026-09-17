/**
 * Protection for the one unauthenticated path in the app: POST /api/bugs,
 * which the MCP agent calls with no login.
 *
 * LAYER 1 (the real boundary): the server binds to 127.0.0.1 only - see the
 * `-H 127.0.0.1` flag in package.json's dev/start scripts and in start.sh /
 * start.bat. A machine on the network cannot open a socket to it at all.
 *
 * LAYER 2 (this file): the request must also *look* local - addressed to a
 * loopback host, with no non-loopback forwarding headers. Note that headers
 * are client-controlled, so this cannot be the boundary on its own; it exists
 * to fail closed if the app is ever put behind a proxy or bound to 0.0.0.0
 * by mistake.
 *
 * LAYER 3 (optional, recommended if you ever change the bind address): set
 * AGENT_TOKEN in .env and in the MCP server's config. When set, the agent must
 * present it. There is no default value - if it is unset the check is simply
 * not part of the chain.
 */
const LOOPBACK = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "::ffff:127.0.0.1"]);

function hostnameOf(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("[")) return trimmed.slice(0, trimmed.indexOf("]") + 1).toLowerCase();
  return trimmed.split(":")[0].toLowerCase();
}

function isLoopbackHost(value: string | null): boolean {
  if (!value) return true; // header absent is fine
  return value.split(",").every((part) => LOOPBACK.has(hostnameOf(part)));
}

export function isLocalRequest(headers: Headers): boolean {
  const host = headers.get("host");
  if (!host || !LOOPBACK.has(hostnameOf(host))) return false;
  if (!isLoopbackHost(headers.get("x-forwarded-host"))) return false;
  // next start populates x-forwarded-for from the socket's remote address.
  if (!isLoopbackHost(headers.get("x-forwarded-for"))) return false;
  if (!isLoopbackHost(headers.get("x-real-ip"))) return false;
  if (headers.get("forwarded")) return false;
  return true;
}

/**
 * Optional shared secret for the agent path. Returns true when AGENT_TOKEN is
 * not configured (the default, localhost-only setup).
 */
export function agentTokenOk(headers: Headers): boolean {
  const expected = process.env.AGENT_TOKEN;
  if (!expected) return true;
  const provided = headers.get("x-agent-token");
  if (!provided || provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  return diff === 0;
}
