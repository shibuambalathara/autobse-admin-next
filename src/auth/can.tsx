"use client";

import type { ReactNode } from "react";
import { useAccess } from "@/auth/use-access";
import type { Permission } from "@/auth/permissions";

export interface CanProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Component-level permission gate.
 * Use instead of inline role checks in pages or modules.
 *
 * @example
 * <Can permission={PERMISSIONS.USERS_CREATE}>
 *   <Button>Add User</Button>
 * </Can>
 */
export function Can({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}: CanProps) {
  const { can, canAny, canAll } = useAccess();

  const allowed = (() => {
    if (permission) return can(permission);
    if (permissions?.length) {
      return requireAll ? canAll(permissions) : canAny(permissions);
    }
    return true;
  })();

  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
}
