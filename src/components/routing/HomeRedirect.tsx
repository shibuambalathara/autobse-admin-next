"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/use-auth";
import { getPostLoginRoute } from "@/auth/default-route";
import { ROUTES } from "@/constants/routes";
import { LoadingState } from "@/components/feedback";

export function HomeRedirect() {
  const router = useRouter();
  const { isAuthenticated, isInitializing, user } = useAuth();

  useEffect(() => {
    if (isInitializing) return;

    if (!isAuthenticated) {
      router.replace(ROUTES.login);
      return;
    }

    router.replace(getPostLoginRoute(user?.role));
  }, [isAuthenticated, isInitializing, router, user?.role]);

  return <LoadingState label="Redirecting…" fullPage />;
}
