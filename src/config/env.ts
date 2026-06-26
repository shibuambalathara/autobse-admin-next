/**
 * Environment configuration aligned with legacy CRA env vars.
 *
 * CRA (autobse-admin-panel)     →  Next.js (autobse-admin-next)
 * REACT_APP_API_URL             →  NEXT_PUBLIC_API_URL
 * REACT_APP_WS_URL              →  NEXT_PUBLIC_WS_URL
 * REACT_APP_API_BASE_URL        →  NEXT_PUBLIC_API_BASE_URL
 * REACT_APP_BASE_URL            →  NEXT_PUBLIC_BASE_URL
 * REACT_APP_TURNSTILE_SITE_KEY  →  NEXT_PUBLIC_TURNSTILE_SITE_KEY
 */
export const env = {
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL ?? process.env.REACT_APP_API_URL ?? "",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? process.env.REACT_APP_WS_URL ?? "",
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.REACT_APP_API_BASE_URL ??
    "",
  baseUrl: (
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.REACT_APP_BASE_URL ??
    ""
  ).trim(),
  turnstileSiteKey: (
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
    process.env.REACT_APP_TURNSTILE_SITE_KEY ??
    ""
  )
    .trim()
    .replace(/^['"]|['"]$/g, ""),
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;

/** GraphQL-specific env derived from shared config. */
export const graphqlEnv = {
  httpUri: env.apiUrl,
  wsUri: env.wsUrl,
  credentials: "include" as RequestCredentials,
} as const;

export function assertEnvConfigured(): void {
  if (!env.apiUrl && env.isDev) {
    console.warn(
      "[AutoBSE] NEXT_PUBLIC_API_URL is not set. Copy .env.example to .env.local"
    );
  }
}

export function getGraphqlHttpUri(): string {
  if (!graphqlEnv.httpUri) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Set it in .env.local"
    );
  }
  return graphqlEnv.httpUri;
}
