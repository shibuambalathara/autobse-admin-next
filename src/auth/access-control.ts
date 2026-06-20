import type { NavItem } from "@/types/navigation";
import { normalizeRole, type AppRole } from "@/auth/roles";
import {
  getPermissionsForRole,
  ROUTE_PERMISSIONS,
  type Permission,
} from "@/auth/permissions";

export function canAccess(
  role: AppRole | null | undefined,
  permission: Permission
): boolean {
  const normalized = normalizeRole(role ?? null);
  if (!normalized) return false;
  return getPermissionsForRole(normalized).includes(permission);
}

export function canAccessAny(
  role: AppRole | null | undefined,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => canAccess(role, p));
}

export function canAccessAll(
  role: AppRole | null | undefined,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => canAccess(role, p));
}

export function canAccessRoute(
  role: AppRole | null | undefined,
  pathname: string
): boolean {
  const permission = getRequiredPermission(pathname);
  if (!permission) return true;
  return canAccess(role, permission);
}

/**
 * Resolve the required permission for a pathname (longest prefix match).
 */
export function getRequiredPermission(pathname: string): Permission | null {
  const normalized = pathname.split("?")[0].replace(/\/$/, "") || "/";
  const routes = Object.keys(ROUTE_PERMISSIONS).sort(
    (a, b) => b.length - a.length
  );

  for (const route of routes) {
    if (normalized === route || normalized.startsWith(`${route}/`)) {
      return ROUTE_PERMISSIONS[route];
    }
  }

  return null;
}

function isNavItemAllowed(item: NavItem, role: AppRole): boolean {
  if (item.permission) return canAccess(role, item.permission);
  if (item.permissions?.length) return canAccessAny(role, item.permissions);
  return true;
}

/**
 * Filter sidebar navigation by centralized permissions.
 */
export function filterNavByPermission(
  items: NavItem[],
  role: AppRole | null | undefined
): NavItem[] {
  const normalized = normalizeRole(role ?? null);
  if (!normalized) return [];

  return items.flatMap((item) => {
    const children = item.children
      ? filterNavByPermission(item.children, normalized)
      : undefined;

    if (item.children) {
      return children?.length ? [{ ...item, children }] : [];
    }

    return isNavItemAllowed(item, normalized) ? [item] : [];
  });
}
