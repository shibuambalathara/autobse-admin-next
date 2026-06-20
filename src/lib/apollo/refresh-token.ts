import { ROUTES } from "@/constants";
import { getGraphqlHttpUri, graphqlEnv } from "@/config/env";
import {
  clearAuthSession,
  getAccessToken,
  setAccessToken,
} from "@/auth/auth-storage";

const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken {
    refreshToken {
      access_token
      refresh_token
    }
  }
`;

let refreshPromise: Promise<string> | null = null;

export interface RefreshTokenOptions {
  /** Redirect to login on failure. Default true for Apollo retry flows. */
  redirectOnFailure?: boolean;
}

/**
 * Cookie-based JWT refresh — compatible with legacy CRA admin panel.
 * Refresh token is httpOnly cookie; access token stored in auth-storage.
 */
export async function refreshAccessToken(
  options: RefreshTokenOptions = {}
): Promise<string> {
  const { redirectOnFailure = true } = options;

  if (refreshPromise) return refreshPromise;

  refreshPromise = performRefresh(redirectOnFailure);

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function performRefresh(redirectOnFailure: boolean): Promise<string> {
  try {
    const response = await fetch(getGraphqlHttpUri(), {
      method: "POST",
      credentials: graphqlEnv.credentials,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: REFRESH_TOKEN_MUTATION }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data = await response.json();
    const accessToken = data?.data?.refreshToken?.access_token as
      | string
      | undefined;

    if (!accessToken) {
      throw new Error("Invalid refresh response");
    }

    setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    clearAuthSession();
    if (redirectOnFailure && typeof window !== "undefined") {
      window.location.href = ROUTES.login;
    }
    throw error;
  }
}

export { getAccessToken };
