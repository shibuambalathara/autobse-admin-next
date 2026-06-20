"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { resetApolloClient } from "@/lib/apollo-client";
import { refreshAccessToken } from "@/lib/apollo/refresh-token";
import { AuthContext, type AuthContextValue } from "@/auth/auth-context";
import {
  clearAuthSession,
  EMPTY_SESSION,
  getAuthSession,
  setAccessToken as persistAccessToken,
  setAuthSession,
  subscribeAuthSession,
  updateAuthUser,
} from "@/auth/auth-storage";
import type { AuthCredentials, AuthUser } from "@/types/auth";

interface AuthProviderProps {
  children: ReactNode;
  /**
   * Attempt cookie-based silent refresh when no access token is stored.
   * Compatible with legacy CRA refresh flow (httpOnly refresh cookie).
   */
  enableSilentRefresh?: boolean;
}

export function AuthProvider({
  children,
  enableSilentRefresh = true,
}: AuthProviderProps) {
  const router = useRouter();
  const [session, setSessionState] = useState(EMPTY_SESSION);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const hydrateSession = useCallback(() => {
    setSessionState(getAuthSession());
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      const current = getAuthSession();
      if (mounted) setSessionState(current);

      if (!current.token && enableSilentRefresh) {
        try {
          setIsRefreshing(true);
          const token = await refreshAccessToken({ redirectOnFailure: false });
          if (mounted) {
            persistAccessToken(token);
            setSessionState(getAuthSession());
          }
        } catch {
          // No valid refresh cookie — remain unauthenticated
        } finally {
          if (mounted) setIsRefreshing(false);
        }
      }

      if (mounted) setIsInitializing(false);
    }

    initialize();

    const unsubscribe = subscribeAuthSession((next) => {
      if (mounted) setSessionState(next);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [enableSilentRefresh]);

  const setSession = useCallback((credentials: AuthCredentials) => {
    setAuthSession(credentials);
    hydrateSession();
  }, [hydrateSession]);

  const setAccessToken = useCallback(
    (token: string) => {
      persistAccessToken(token);
      hydrateSession();
    },
    [hydrateSession]
  );

  const updateUser = useCallback(
    (partial: Partial<AuthUser>) => {
      updateAuthUser(partial);
      hydrateSession();
    },
    [hydrateSession]
  );

  const logout = useCallback(() => {
    clearAuthSession();
    resetApolloClient();
    setSessionState({ token: null, user: null });
    router.replace(ROUTES.login);
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session.user,
      accessToken: session.token,
      isAuthenticated: Boolean(session.user && session.token),
      isInitializing,
      isRefreshing,
      setSession,
      setAccessToken,
      updateUser,
      setRefreshing: setIsRefreshing,
      logout,
    }),
    [
      session,
      isInitializing,
      isRefreshing,
      setSession,
      setAccessToken,
      updateUser,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
