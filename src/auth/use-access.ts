"use client";

import { useMemo } from "react";
import { useAuth } from "@/auth/use-auth";
import { getAuthRole } from "@/auth/auth-guards";
import {
  canAccess,
  canAccessAll,
  canAccessAny,
  canAccessRoute,
} from "@/auth/access-control";
import { getPermissionsForRole, type Permission } from "@/auth/permissions";

export function useAccess() {
  const { user, isAuthenticated } = useAuth();
  const role = getAuthRole(user);

  return useMemo(
    () => ({
      user,
      role,
      isAuthenticated,
      permissions: getPermissionsForRole(role),
      can: (permission: Permission) => canAccess(role, permission),
      canAny: (permissions: Permission[]) => canAccessAny(role, permissions),
      canAll: (permissions: Permission[]) => canAccessAll(role, permissions),
      canAccessRoute: (pathname: string) => canAccessRoute(role, pathname),
    }),
    [user, role, isAuthenticated]
  );
}

export type UseAccessReturn = ReturnType<typeof useAccess>;
