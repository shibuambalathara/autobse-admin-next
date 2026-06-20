"use client";

import { useContext } from "react";
import {
  AUTH_CONTEXT_ERROR,
  AuthContext,
  type AuthContextValue,
} from "@/auth/auth-context";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(AUTH_CONTEXT_ERROR);
  }

  return context;
}
