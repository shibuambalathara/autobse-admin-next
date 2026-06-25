"use client";

import { useAuth } from "@/auth/use-auth";
import { APP_ROLES, isRole } from "@/auth/roles";
import { useAccess } from "@/auth/use-access";

export function useAuthenticatedAdminQuery() {
  const { isAuthenticated, isInitializing, isRefreshing, accessToken } =
    useAuth();
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);

  const canFetch =
    isAdmin &&
    isAuthenticated &&
    !isInitializing &&
    !isRefreshing &&
    Boolean(accessToken);

  return { canFetch, isAdmin };
}
