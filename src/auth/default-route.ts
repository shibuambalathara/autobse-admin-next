import { APP_ROLES, isRole, normalizeRole } from "@/auth/roles";
import { ROUTES } from "@/constants/routes";

export function getPostLoginRoute(role?: string | null): string {
  return isRole(normalizeRole(role), APP_ROLES.ADMIN)
    ? ROUTES.dashboard
    : ROUTES.users;
}

export function getDefaultHomeLabel(role?: string | null): string {
  return isRole(normalizeRole(role), APP_ROLES.ADMIN)
    ? "Go to Dashboard"
    : "Go to Users";
}
