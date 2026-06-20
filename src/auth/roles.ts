/**
 * Application roles — aligned with legacy AutoBSE admin panel.
 * Extend APP_ROLES when new roles are introduced.
 */
export const APP_ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  ACCOUNTANT: "accountant",
  HR: "hr",
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES] | (string & {});

export const KNOWN_ROLES = Object.values(APP_ROLES) as AppRole[];

export function normalizeRole(role?: string | null): AppRole | null {
  if (!role) return null;
  return role.toLowerCase() as AppRole;
}

export function isKnownRole(role: string): role is (typeof APP_ROLES)[keyof typeof APP_ROLES] {
  return KNOWN_ROLES.includes(role.toLowerCase() as AppRole);
}

export function isRole(role: AppRole | null, target: AppRole): boolean {
  return normalizeRole(role) === normalizeRole(target);
}
