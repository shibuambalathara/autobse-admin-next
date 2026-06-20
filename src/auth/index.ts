export { AuthProvider } from "./auth-provider";
export { AuthContext, AUTH_CONTEXT_ERROR } from "./auth-context";
export type { AuthContextValue } from "./auth-context";

export { useAuth } from "./use-auth";

export {
  getAuthSession,
  getAccessToken,
  getAuthToken,
  getAuthUser,
  setAuthSession,
  setAccessToken,
  updateAuthUser,
  clearAuthSession,
  subscribeAuthSession,
} from "./auth-storage";
export type { PersistedAuthSession } from "./auth-storage";

export {
  PUBLIC_ROUTES,
  isPublicRoute,
  requiresAuthentication,
  evaluateRouteGuard,
  evaluatePermissionGuard,
  getAuthRole,
} from "./auth-guards";
export type {
  AuthGuardReason,
  AuthGuardResult,
  AuthGuardInput,
  PermissionGuardInput,
} from "./auth-guards";

export { APP_ROLES, KNOWN_ROLES, normalizeRole, isKnownRole, isRole } from "./roles";
export type { AppRole } from "./roles";

export {
  PERMISSIONS,
  ROUTE_PERMISSIONS,
  registerRolePermissions,
  getPermissionsForRole,
} from "./permissions";
export type { Permission } from "./permissions";

export {
  canAccess,
  canAccessAny,
  canAccessAll,
  canAccessRoute,
  getRequiredPermission,
  filterNavByPermission,
} from "./access-control";

export { useAccess } from "./use-access";
export type { UseAccessReturn } from "./use-access";

export { Can } from "./can";
export type { CanProps } from "./can";

export { ProtectedRoute, RouteGuard } from "./protected-route";
export { AccessDenied } from "./access-denied";
