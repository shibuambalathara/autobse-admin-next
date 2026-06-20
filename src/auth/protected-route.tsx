"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/auth/use-auth";
import { useAccess } from "@/auth/use-access";
import {
  evaluatePermissionGuard,
  evaluateRouteGuard,
  getAuthRole,
} from "@/auth/auth-guards";
import { AccessDenied } from "@/auth/access-denied";
import { LoadingState } from "@/components/feedback";
import type { Permission } from "@/auth/permissions";

interface ProtectedRouteProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback,
}: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isInitializing, isAuthenticated } = useAuth();
  const { role } = useAccess();

  const routeGuard = evaluateRouteGuard({
    isInitializing,
    isAuthenticated,
    role: getAuthRole({ role: role ?? undefined }),
    pathname,
  });

  const permissionAllowed = evaluatePermissionGuard({
    role,
    permission,
    permissions,
    requireAll,
  });

  const isAllowed = routeGuard.allowed && permissionAllowed;

  useEffect(() => {
    if (routeGuard.reason === "unauthenticated") {
      router.replace(ROUTES.login);
    }
  }, [routeGuard.reason, router]);

  if (routeGuard.reason === "loading" || isInitializing) {
    return <LoadingState label="Checking access…" fullPage />;
  }

  if (routeGuard.reason === "unauthenticated") {
    return <LoadingState label="Redirecting to login…" fullPage />;
  }

  if (!isAllowed) {
    return (
      fallback ?? (
        <AccessDenied
          description={
            routeGuard.requiredPermission
              ? `Required permission: ${routeGuard.requiredPermission}`
              : undefined
          }
        />
      )
    );
  }

  return <>{children}</>;
}

export function RouteGuard({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
