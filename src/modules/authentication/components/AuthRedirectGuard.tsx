"use client";

import type { ReactNode } from "react";
import { LoadingState } from "@/components/feedback";
import { useAuthRedirect } from "@/modules/authentication/hooks/useAuthRedirect";

export function AuthRedirectGuard({ children }: { children: ReactNode }) {
  const { isInitializing, isAuthenticated } = useAuthRedirect();

  if (isInitializing) {
    return <LoadingState label="Loading…" fullPage />;
  }

  if (isAuthenticated) {
    return <LoadingState label="Redirecting…" fullPage />;
  }

  return <>{children}</>;
}
