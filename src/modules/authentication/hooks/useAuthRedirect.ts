"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/use-auth";
import { ROUTES } from "@/constants/routes";

export function useAuthRedirect() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace(ROUTES.dashboard);
    }
  }, [isAuthenticated, isInitializing, router]);

  return { isInitializing, isAuthenticated };
}
