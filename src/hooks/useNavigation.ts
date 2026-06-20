"use client";

import { usePathname } from "next/navigation";
import { useAccess } from "@/auth/use-access";
import {
  getBreadcrumbsForRole,
  getNavigationForRole,
  isRouteActive,
  findNavItemByPath,
} from "@/config/navigation";

export function useNavigation() {
  const pathname = usePathname();
  const { role } = useAccess();

  const items = getNavigationForRole(role);
  const breadcrumbs = getBreadcrumbsForRole(pathname, role);
  const currentItem = findNavItemByPath(pathname, items);

  return {
    items,
    breadcrumbs,
    currentItem,
    pathname,
    isActive: (href: string) => isRouteActive(href, pathname),
  };
}
