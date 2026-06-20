import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  MapPin,
  Car,
  Bell,
  Settings,
  Gavel,
  MessageSquare,
  Building2,
  UserX,
  Clock,
  Search,
  Layers,
} from "lucide-react";
import { filterNavByPermission } from "@/auth/access-control";
import type { AppRole } from "@/auth/roles";
import { PERMISSIONS } from "@/auth/permissions";
import { ROUTES } from "@/constants/routes";
import type { BreadcrumbItem, NavItem, NavModule } from "@/types/navigation";

// ─── Module registry (extend when adding new admin modules) ─────────────────

export const NAV_MODULES = {
  overview: { id: "overview", label: "Overview" },
  users: { id: "users", label: "User Management" },
  events: { id: "events", label: "Events" },
  auctions: { id: "auctions", label: "Auctions" },
  inventory: { id: "inventory", label: "Inventory" },
  finance: { id: "finance", label: "Finance" },
  system: { id: "system", label: "System" },
} as const satisfies Record<string, NavModule>;

// ─── Navigation tree (single source of truth) ───────────────────────────────

/**
 * Central navigation configuration.
 *
 * - `permission` drives sidebar visibility via RBAC (`filterNavByPermission`)
 * - `children` enables nested sidebar menus
 * - `icon` is used in sidebar rendering
 * - Breadcrumbs are generated from this tree via `getBreadcrumbs()`
 */
export const NAVIGATION: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
    module: NAV_MODULES.overview.id,
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    id: "users",
    label: "Users",
    href: ROUTES.users,
    icon: Users,
    module: NAV_MODULES.users.id,
    permission: PERMISSIONS.USERS_READ,
    hideInBreadcrumb: true,
    children: [
      {
        id: "users-list",
        label: "All Users",
        href: ROUTES.users,
        icon: Users,
        module: NAV_MODULES.users.id,
        permission: PERMISSIONS.USERS_READ,
      },
      {
        id: "users-deleted",
        label: "Deleted Users",
        href: ROUTES.usersDeleted,
        icon: UserX,
        module: NAV_MODULES.users.id,
        permission: PERMISSIONS.USERS_DELETE,
      },
      {
        id: "users-pending",
        label: "Pending Users",
        href: ROUTES.usersPending,
        icon: Clock,
        module: NAV_MODULES.users.id,
        permission: PERMISSIONS.USERS_PENDING,
      },
    ],
  },
  {
    id: "events",
    label: "Events",
    href: ROUTES.events,
    icon: Calendar,
    module: NAV_MODULES.events.id,
    permission: PERMISSIONS.EVENTS_READ,
    hideInBreadcrumb: true,
    children: [
      {
        id: "events-list",
        label: "All Events",
        href: ROUTES.events,
        icon: Calendar,
        module: NAV_MODULES.events.id,
        permission: PERMISSIONS.EVENTS_READ,
      },
      {
        id: "events-types",
        label: "Event Types",
        href: ROUTES.eventsTypes,
        icon: Layers,
        module: NAV_MODULES.events.id,
        permission: PERMISSIONS.EVENTS_TYPES_MANAGE,
      },
    ],
  },
  {
    id: "auctions",
    label: "Auctions",
    href: ROUTES.auctions,
    icon: Gavel,
    module: NAV_MODULES.auctions.id,
    permission: PERMISSIONS.AUCTIONS_READ,
    hideInBreadcrumb: true,
    children: [
      {
        id: "auctions-open",
        label: "Open Auctions",
        href: ROUTES.auctions,
        icon: Gavel,
        module: NAV_MODULES.auctions.id,
        permission: PERMISSIONS.AUCTIONS_READ,
      },
      {
        id: "auctions-find",
        label: "Find Auction",
        href: ROUTES.auctionsFind,
        icon: Search,
        module: NAV_MODULES.auctions.id,
        permission: PERMISSIONS.AUCTIONS_MANAGE,
      },
    ],
  },
  {
    id: "vehicles",
    label: "Vehicles",
    href: ROUTES.vehicles,
    icon: Car,
    module: NAV_MODULES.inventory.id,
    permission: PERMISSIONS.VEHICLES_READ,
  },
  {
    id: "sellers",
    label: "Sellers",
    href: ROUTES.sellers,
    icon: Building2,
    module: NAV_MODULES.inventory.id,
    permission: PERMISSIONS.SELLERS_READ,
  },
  {
    id: "payments",
    label: "Payments",
    href: ROUTES.payments,
    icon: CreditCard,
    module: NAV_MODULES.finance.id,
    permission: PERMISSIONS.PAYMENTS_READ,
  },
  {
    id: "locations",
    label: "Locations",
    href: ROUTES.locations,
    icon: MapPin,
    module: NAV_MODULES.system.id,
    permission: PERMISSIONS.LOCATIONS_READ,
  },
  {
    id: "notifications",
    label: "Notifications",
    href: ROUTES.notifications,
    icon: Bell,
    module: NAV_MODULES.system.id,
    permission: PERMISSIONS.NOTIFICATIONS_READ,
  },
  {
    id: "enquiries",
    label: "Enquiries",
    href: ROUTES.enquiries,
    icon: MessageSquare,
    module: NAV_MODULES.system.id,
    permission: PERMISSIONS.ENQUIRIES_READ,
  },
  {
    id: "settings",
    label: "Settings",
    href: ROUTES.settings,
    icon: Settings,
    module: NAV_MODULES.system.id,
    permission: PERMISSIONS.SETTINGS_READ,
  },
];

/** @deprecated Use NAVIGATION — kept for backward compatibility. */
export const navigationConfig = NAVIGATION;

// ─── Route matching ───────────────────────────────────────────────────────────

export function normalizePathname(pathname: string): string {
  return pathname.split("?")[0].replace(/\/$/, "") || "/";
}

/**
 * Determines if a nav href is active for the current pathname.
 * Dashboard uses exact match; other routes support nested paths.
 */
export function isRouteActive(href: string, pathname: string): boolean {
  const current = normalizePathname(pathname);
  const target = normalizePathname(href);

  if (target === ROUTES.dashboard) {
    return current === ROUTES.dashboard;
  }

  return current === target || current.startsWith(`${target}/`);
}

export function hasActiveChild(item: NavItem, pathname: string): boolean {
  return (
    isRouteActive(item.href, pathname) ||
    (item.children?.some(
      (child) =>
        isRouteActive(child.href, pathname) || hasActiveChild(child, pathname)
    ) ??
      false)
  );
}

// ─── Permission-filtered navigation ─────────────────────────────────────────

/** Returns sidebar navigation filtered by role permissions (RBAC). */
export function getNavigationForRole(role: AppRole | null | undefined): NavItem[] {
  return filterNavByPermission(NAVIGATION, role);
}

// ─── Tree utilities ───────────────────────────────────────────────────────────

export function flattenNavigation(
  items: NavItem[] = NAVIGATION,
  result: NavItem[] = []
): NavItem[] {
  for (const item of items) {
    result.push(item);
    if (item.children?.length) {
      flattenNavigation(item.children, result);
    }
  }
  return result;
}

export function findNavItemById(
  id: string,
  items: NavItem[] = NAVIGATION
): NavItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children?.length) {
      const found = findNavItemById(id, item.children);
      if (found) return found;
    }
  }
  return null;
}

/** Finds the most specific nav item matching the current pathname. */
export function findNavItemByPath(
  pathname: string,
  items: NavItem[] = NAVIGATION
): NavItem | null {
  let bestMatch: NavItem | null = null;

  function walk(nodes: NavItem[]) {
    for (const item of nodes) {
      if (isRouteActive(item.href, pathname)) {
        if (!bestMatch || item.href.length >= bestMatch.href.length) {
          bestMatch = item;
        }
      }
      if (item.children?.length) walk(item.children);
    }
  }

  walk(items);
  return bestMatch;
}

/** Builds ancestor trail from root to the target nav item id. */
export function findNavTrail(
  targetId: string,
  items: NavItem[] = NAVIGATION,
  trail: NavItem[] = []
): NavItem[] | null {
  for (const item of items) {
    const nextTrail = [...trail, item];

    if (item.id === targetId) {
      return nextTrail;
    }

    if (item.children?.length) {
      const childTrail = findNavTrail(targetId, item.children, nextTrail);
      if (childTrail) return childTrail;
    }
  }

  return null;
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

export function getBreadcrumbs(
  pathname: string,
  items: NavItem[] = NAVIGATION
): BreadcrumbItem[] {
  const match = findNavItemByPath(pathname, items);

  if (!match) {
    return [{ id: "dashboard", label: "Dashboard", href: ROUTES.dashboard }];
  }

  const trail = findNavTrail(match.id, items) ?? [match];

  const crumbs = trail
    .filter((item) => !item.hideInBreadcrumb)
    .map((item, index, array) => ({
      id: item.id,
      label: item.label,
      href: index < array.length - 1 ? item.href : undefined,
    }));

  return crumbs.length > 0
    ? crumbs
    : [{ id: match.id, label: match.label }];
}

/** Breadcrumbs filtered by role — only shows items the user can access. */
export function getBreadcrumbsForRole(
  pathname: string,
  role: AppRole | null | undefined
): BreadcrumbItem[] {
  const filteredNav = getNavigationForRole(role);
  return getBreadcrumbs(pathname, filteredNav);
}
