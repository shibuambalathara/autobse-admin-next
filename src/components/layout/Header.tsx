"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { useAccess } from "@/auth/use-access";
import { getBreadcrumbsForRole } from "@/config/navigation";
import { ROUTES } from "@/constants/routes";
import { Button, Input } from "@/components/ui";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuToggle: () => void;
  onSidebarCollapse?: () => void;
  isCollapsed?: boolean;
  showCollapseToggle?: boolean;
  className?: string;
}

export function Header({
  onMenuToggle,
  onSidebarCollapse,
  isCollapsed,
  showCollapseToggle,
  className,
}: HeaderProps) {
  const pathname = usePathname();
  const { role } = useAccess();
  const crumbs = getBreadcrumbsForRole(pathname, role);
  const mobileTitle =
    pathname === ROUTES.users || pathname === `${ROUTES.users}/`
      ? "Users"
      : pathname === ROUTES.events || pathname === `${ROUTES.events}/`
        ? "Events"
        : crumbs[crumbs.length - 1]?.label;

  return (
    <header
      className={cn(
        "sticky top-0 z-header flex h-14 shrink-0 items-center gap-3 border-b border-surface-border bg-white px-4 shadow-header",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="shrink-0 lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {mobileTitle && (
        <div className="min-w-0 flex-1 text-center lg:hidden">
          <span className="truncate text-base font-bold text-brand-900">
            {mobileTitle}
          </span>
        </div>
      )}

      {showCollapseToggle && onSidebarCollapse && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarCollapse}
          className="hidden shrink-0 lg:flex"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      )}

      <div className="relative hidden flex-1 sm:block sm:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
        <Input
          placeholder="Search…"
          className="pl-9"
          aria-label="Global search"
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative hidden sm:flex"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <ProfileDropdown />
      </div>
    </header>
  );
}
