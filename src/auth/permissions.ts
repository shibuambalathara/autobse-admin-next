import { ROUTES } from "@/constants/routes";
import { APP_ROLES, type AppRole } from "@/auth/roles";

/**
 * Central permission registry.
 * Add new permissions here — never hardcode permission strings in pages.
 */
export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard:view",

  USERS_READ: "users:read",
  USERS_CREATE: "users:create",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",
  USERS_PENDING: "users:pending",

  EVENTS_READ: "events:read",
  EVENTS_MANAGE: "events:manage",
  EVENTS_TYPES_MANAGE: "events:types:manage",

  AUCTIONS_READ: "auctions:read",
  AUCTIONS_MANAGE: "auctions:manage",

  VEHICLES_READ: "vehicles:read",
  VEHICLES_MANAGE: "vehicles:manage",

  SELLERS_READ: "sellers:read",
  SELLERS_MANAGE: "sellers:manage",

  PAYMENTS_READ: "payments:read",
  PAYMENTS_MANAGE: "payments:manage",

  LOCATIONS_READ: "locations:read",
  LOCATIONS_MANAGE: "locations:manage",

  NOTIFICATIONS_READ: "notifications:read",
  NOTIFICATIONS_MANAGE: "notifications:manage",

  ENQUIRIES_READ: "enquiries:read",
  ENQUIRIES_MANAGE: "enquiries:manage",

  SETTINGS_READ: "settings:read",
  SETTINGS_MANAGE: "settings:manage",

  SYSTEM_COMPONENTS_VIEW: "system:components:view",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ALL_PERMISSIONS = Object.values(PERMISSIONS) as Permission[];

/** Role → permissions matrix (mirrors legacy sideBarData.tsx access). */
const BASE_ROLE_PERMISSIONS: Record<string, readonly Permission[]> = {
  [APP_ROLES.ADMIN]: ALL_PERMISSIONS,

  [APP_ROLES.STAFF]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.EVENTS_READ,
    PERMISSIONS.AUCTIONS_READ,
    PERMISSIONS.VEHICLES_READ,
    PERMISSIONS.SELLERS_READ,
    PERMISSIONS.PAYMENTS_READ,
  ],

  [APP_ROLES.ACCOUNTANT]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.EVENTS_READ,
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.PAYMENTS_MANAGE,
  ],

  [APP_ROLES.HR]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.EVENTS_READ,
    PERMISSIONS.PAYMENTS_READ,
  ],
};

/** Extensible role permission store for future roles. */
const rolePermissionRegistry = new Map<string, Set<Permission>>(
  Object.entries(BASE_ROLE_PERMISSIONS).map(([role, permissions]) => [
    role,
    new Set(permissions),
  ])
);

/**
 * Register or extend permissions for a role at runtime (e.g. after backend sync).
 */
export function registerRolePermissions(
  role: AppRole,
  permissions: Permission[]
): void {
  const key = role.toLowerCase();
  const existing = rolePermissionRegistry.get(key) ?? new Set<Permission>();
  permissions.forEach((p) => existing.add(p));
  rolePermissionRegistry.set(key, existing);
}

export function getPermissionsForRole(role: AppRole | null): Permission[] {
  if (!role) return [];
  const set = rolePermissionRegistry.get(role.toLowerCase());
  return set ? Array.from(set) : [];
}

/**
 * Route → required permission map.
 * Used by route-level protection — do not duplicate in page files.
 */
export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  [ROUTES.dashboard]: PERMISSIONS.DASHBOARD_VIEW,
  [ROUTES.users]: PERMISSIONS.USERS_READ,
  [ROUTES.usersAdd]: PERMISSIONS.USERS_CREATE,
  [ROUTES.usersDeleted]: PERMISSIONS.USERS_DELETE,
  [ROUTES.usersPending]: PERMISSIONS.USERS_PENDING,
  [ROUTES.events]: PERMISSIONS.EVENTS_READ,
  [ROUTES.eventsAdd]: PERMISSIONS.EVENTS_READ,
  "/view-vehicls": PERMISSIONS.EVENTS_READ,
  [ROUTES.eventsTypes]: PERMISSIONS.EVENTS_TYPES_MANAGE,
  [ROUTES.auctions]: PERMISSIONS.AUCTIONS_READ,
  [ROUTES.auctionsFind]: PERMISSIONS.AUCTIONS_MANAGE,
  [ROUTES.vehicles]: PERMISSIONS.VEHICLES_READ,
  [ROUTES.sellers]: PERMISSIONS.SELLERS_READ,
  [ROUTES.payments]: PERMISSIONS.PAYMENTS_READ,
  [ROUTES.locations]: PERMISSIONS.LOCATIONS_READ,
  [ROUTES.notifications]: PERMISSIONS.NOTIFICATIONS_READ,
  [ROUTES.enquiries]: PERMISSIONS.ENQUIRIES_READ,
  [ROUTES.settings]: PERMISSIONS.SETTINGS_READ,
  [ROUTES.components]: PERMISSIONS.SYSTEM_COMPONENTS_VIEW,
};
