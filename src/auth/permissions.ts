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

  EVENT_BOTS_READ: "event-bots:read",
  EVENT_BOTS_MANAGE: "event-bots:manage",

  CRM_READ: "crm:read",
  CRM_MANAGE: "crm:manage",

  AUCTIONS_READ: "auctions:read",
  AUCTIONS_MANAGE: "auctions:manage",

  VEHICLES_READ: "vehicles:read",
  VEHICLES_MANAGE: "vehicles:manage",

  BIDS_READ: "bids:read",
  BIDS_MANAGE: "bids:manage",
  BIDS_ADMIN: "bids:admin",

  SELLERS_READ: "sellers:read",
  SELLERS_MANAGE: "sellers:manage",

  PAYMENTS_READ: "payments:read",
  PAYMENTS_CREATE: "payments:create",
  PAYMENTS_MANAGE: "payments:manage",
  PAYMENTS_ADMIN: "payments:admin",

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
    PERMISSIONS.BIDS_READ,
    PERMISSIONS.SELLERS_READ,
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.PAYMENTS_CREATE,
    PERMISSIONS.EVENT_BOTS_READ,
    PERMISSIONS.EVENT_BOTS_MANAGE,
    PERMISSIONS.CRM_READ,
    PERMISSIONS.CRM_MANAGE,
  ],

  [APP_ROLES.ACCOUNTANT]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.EVENTS_READ,
    PERMISSIONS.BIDS_READ,
    PERMISSIONS.BIDS_MANAGE,
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.PAYMENTS_CREATE,
    PERMISSIONS.PAYMENTS_MANAGE,
  ],

  [APP_ROLES.HR]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.EVENTS_READ,
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.PAYMENTS_CREATE,
    PERMISSIONS.PAYMENTS_MANAGE,
    PERMISSIONS.CRM_READ,
    PERMISSIONS.CRM_MANAGE,
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
  "/upload-excel": PERMISSIONS.EVENTS_READ,
  "/add-vehicle": PERMISSIONS.VEHICLES_MANAGE,
  "/edit-vehicle": PERMISSIONS.VEHICLES_MANAGE,
  "/Deleted-vehicles": PERMISSIONS.VEHICLES_MANAGE,
  "/vehicle-status-history": PERMISSIONS.VEHICLES_READ,
  "/bid-details": PERMISSIONS.BIDS_READ,
  "/deleted-bids": PERMISSIONS.BIDS_ADMIN,
  "/bids-user": PERMISSIONS.BIDS_MANAGE,
  "/openAuction-bid": PERMISSIONS.BIDS_ADMIN,
  [ROUTES.eventsTypes]: PERMISSIONS.EVENTS_TYPES_MANAGE,
  [ROUTES.eventBots]: PERMISSIONS.EVENT_BOTS_READ,
  [ROUTES.eventBotsAdd]: PERMISSIONS.EVENT_BOTS_MANAGE,
  [ROUTES.eventBotsDeleted]: PERMISSIONS.EVENT_BOTS_READ,
  [ROUTES.crm]: PERMISSIONS.CRM_READ,
  [ROUTES.crmAdd]: PERMISSIONS.CRM_MANAGE,
  [ROUTES.crmDeleted]: PERMISSIONS.CRM_READ,
  [ROUTES.crmUpload]: PERMISSIONS.CRM_MANAGE,
  "/crm/call-logs": PERMISSIONS.CRM_MANAGE,
  [ROUTES.auctions]: PERMISSIONS.AUCTIONS_READ,
  [ROUTES.auctionsFind]: PERMISSIONS.AUCTIONS_MANAGE,
  [ROUTES.vehicles]: PERMISSIONS.VEHICLES_READ,
  [ROUTES.sellers]: PERMISSIONS.SELLERS_READ,
  [ROUTES.payments]: PERMISSIONS.PAYMENTS_READ,
  [ROUTES.paymentsCreate]: PERMISSIONS.PAYMENTS_CREATE,
  [ROUTES.locations]: PERMISSIONS.LOCATIONS_READ,
  [ROUTES.notifications]: PERMISSIONS.NOTIFICATIONS_READ,
  [ROUTES.enquiries]: PERMISSIONS.ENQUIRIES_READ,
  [ROUTES.settings]: PERMISSIONS.SETTINGS_READ,
  "/payment": PERMISSIONS.PAYMENTS_READ,
  "/create-payment": PERMISSIONS.PAYMENTS_CREATE,
  "/update-payment": PERMISSIONS.PAYMENTS_MANAGE,
  "/add-emd": PERMISSIONS.PAYMENTS_MANAGE,
  "/emdDetails": PERMISSIONS.PAYMENTS_ADMIN,
  "/payment-history": PERMISSIONS.PAYMENTS_READ,
  [ROUTES.components]: PERMISSIONS.SYSTEM_COMPONENTS_VIEW,
};
