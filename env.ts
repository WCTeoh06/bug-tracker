/**
 * Required environment configuration.
 *
 * SECURITY: there are deliberately NO fallback/default values for secrets.
 * If something required is missing the app throws on first use instead of
 * silently running with a hardcoded value.
 */

function required(name: string, minLength = 1): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env and fill it in.`,
    );
  }
  if (value.length < minLength) {
    throw new Error(`Environment variable ${name} must be at least ${minLength} characters long.`);
  }
  return value;
}

export function databaseUrl(): string {
  return required("DATABASE_URL");
}

export function authPassword(): string {
  return required("AUTH_PASSWORD", 8);
}

export function sessionSecret(): string {
  return required("SESSION_SECRET", 32);
}
