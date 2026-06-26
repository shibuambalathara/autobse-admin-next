"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/auth/use-auth";
import { LoadingState } from "@/components/feedback";

export function RequireAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace(ROUTES.login);
    }
  }, [isAuthenticated, isInitializing, router]);

  if (isInitializing) {
    return <LoadingState label="Loading…" fullPage />;
  }

  if (!isAuthenticated) {
    return <LoadingState label="Redirecting to login…" fullPage />;
  }

  return <>{children}</>;
}
