import type { LucideIcon } from "lucide-react";
import type { Permission } from "@/auth/permissions";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** Module grouping key for scalable multi-module nav. */
  module?: string;
  /** Single permission required to view this nav item. */
  permission?: Permission;
  /** Any of these permissions grants visibility. */
  permissions?: Permission[];
  /** Omit from breadcrumb trail (e.g. duplicate parent href). */
  hideInBreadcrumb?: boolean;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
}

export interface NavModule {
  id: string;
  label: string;
}

export type SidebarMode = "expanded" | "collapsed" | "drawer";
