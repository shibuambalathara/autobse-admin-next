"use client";

import { useAuth } from "@/auth/use-auth";

/**
 * Gate Apollo queries until the session is hydrated and a bearer token is available.
 * Prevents premature "Unauthorized" errors during silent refresh / initial load.
 */
export function useAuthenticatedQuery() {
  const { isAuthenticated, isInitializing, isRefreshing, accessToken } =
    useAuth();

  const canFetch =
    isAuthenticated &&
    !isInitializing &&
    !isRefreshing &&
    Boolean(accessToken);

  return { canFetch };
}
