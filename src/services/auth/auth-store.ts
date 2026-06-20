/**
 * @deprecated Use `@/auth` hooks and storage instead.
 * Thin re-export bridge for legacy imports during migration.
 */
export {
  getAccessToken as getAuthToken,
  getAuthSession,
  setAuthSession,
  clearAuthSession,
  setAccessToken,
  updateAuthUser,
  getAuthUser,
} from "@/auth/auth-storage";

export { useAuth as useAuthStore } from "@/auth/use-auth";
