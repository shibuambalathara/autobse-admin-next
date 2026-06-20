import type { LoginUser } from "@/modules/authentication/types";
import type { AuthUser } from "@/types/auth";
import { normalizeRole } from "@/auth/roles";

export function mapLoginUserToAuthUser(user: LoginUser | null): AuthUser | null {
  if (!user?.id) return null;

  return {
    id: user.id,
    role: normalizeRole(user.role) ?? "staff",
    firstName: user.firstName ?? "User",
  };
}
