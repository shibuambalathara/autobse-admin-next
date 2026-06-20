"use client";

import { createContext } from "react";
import type { AuthCredentials, AuthUser } from "@/types/auth";

export interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isRefreshing: boolean;
  /** Establish session after successful login (wire during migration). */
  setSession: (credentials: AuthCredentials) => void;
  /** Update JWT access token after refresh. */
  setAccessToken: (token: string) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
  setRefreshing: (isRefreshing: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AUTH_CONTEXT_ERROR =
  "useAuth must be used within an AuthProvider";
