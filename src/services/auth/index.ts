export {
  getAccessToken as getAuthToken,
  getAuthSession,
  setAuthSession,
  clearAuthSession,
  setAccessToken,
  updateAuthUser,
  getAuthUser,
} from "@/auth/auth-storage";

export { useAuth } from "@/auth/use-auth";

/** @deprecated Use useAuth from @/auth */
export { useAuth as useAuthStore } from "@/auth/use-auth";
