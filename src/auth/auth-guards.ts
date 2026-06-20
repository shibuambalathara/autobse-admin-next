import { ROUTES } from "@/constants/routes";
import {
  canAccess,
  canAccessAll,
  canAccessAny,
  canAccessRoute,
  getRequiredPermission,
} from "@/auth/access-control";
import { normalizeRole, type AppRole } from "@/auth/roles";
import type { Permission } from "@/auth/permissions";

export const PUBLIC_ROUTES = [
  ROUTES.login,
  ROUTES.home,
  ROUTES.accountRecovery,
] as const;

export type AuthGuardReason =
  | "loading"
  | "unauthenticated"
  | "forbidden"
  | "allowed";

export interface AuthGuardResult {
  allowed: boolean;
  reason: AuthGuardReason;
  requiredPermission: Permission | null;
}

export interface AuthGuardInput {
  isInitializing: boolean;
  isAuthenticated: boolean;
  role: AppRole | null;
  pathname: string;
}

export function isPublicRoute(pathname: string): boolean {
  const normalized = pathname.split("?")[0].replace(/\/$/, "") || "/";
  return PUBLIC_ROUTES.some(
    (route) => normalized === route || normalized.startsWith(`${route}/`)
  );
}

export function requiresAuthentication(pathname: string): boolean {
  return !isPublicRoute(pathname);
}

/**
 * Combined auth + RBAC route guard.
 * Used by ProtectedRoute — do not duplicate checks in pages.
 */
export function evaluateRouteGuard({
  isInitializing,
  isAuthenticated,
  role,
  pathname,
}: AuthGuardInput): AuthGuardResult {
  const requiredPermission = getRequiredPermission(pathname);

  if (isInitializing) {
    return { allowed: false, reason: "loading", requiredPermission };
  }

  if (requiresAuthentication(pathname) && !isAuthenticated) {
    return { allowed: false, reason: "unauthenticated", requiredPermission };
  }

  if (isAuthenticated && !canAccessRoute(role, pathname)) {
    return { allowed: false, reason: "forbidden", requiredPermission };
  }

  return { allowed: true, reason: "allowed", requiredPermission };
}

export interface PermissionGuardInput {
  role: AppRole | null;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
}

export function evaluatePermissionGuard({
  role,
  permission,
  permissions,
  requireAll = false,
}: PermissionGuardInput): boolean {
  if (permission) return canAccess(role, permission);
  if (permissions?.length) {
    return requireAll
      ? canAccessAll(role, permissions)
      : canAccessAny(role, permissions);
  }
  return true;
}

export function getAuthRole(
  user?: { role?: string } | null
): AppRole | null {
  return normalizeRole(user?.role ?? null);
}
