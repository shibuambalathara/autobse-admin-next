import { APP_ROLES, type AppRole } from "@/auth/roles";

export const USER_ROLES = [
  APP_ROLES.ADMIN,
  APP_ROLES.STAFF,
  APP_ROLES.ACCOUNTANT,
  APP_ROLES.HR,
] as const satisfies readonly AppRole[];

export const DEFAULT_ROLE: AppRole = APP_ROLES.ADMIN;

export { APP_ROLES, type AppRole as UserRole } from "@/auth/roles";
