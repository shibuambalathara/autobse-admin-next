import type { AppRole } from "@/auth/roles";

export type UserRole = AppRole;

export interface AuthUser {
  id: string;
  role: UserRole;
  firstName: string;
  lastName?: string;
  email?: string;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isRefreshing: boolean;
}

export interface AuthCredentials {
  token: string;
  user: AuthUser | null;
}

/** Session shape after login — wire to backend response during migration. */
export interface AuthSession extends AuthCredentials {
  token: string;
}
