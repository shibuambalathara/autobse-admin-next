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
      : pathname === ROUTES.usersOtpUnverified
        ? "OTP Unverified Users"
        : pathname === ROUTES.events || pathname === `${ROUTES.events}/`
        ? "Events"
        : pathname === ROUTES.sellers || pathname.startsWith(`${ROUTES.sellers}/`)
          ? "Sellers"
          : pathname === ROUTES.locations || pathname.startsWith(`${ROUTES.locations}/`)
            ? "Locations"
            : pathname === ROUTES.states || pathname.startsWith(`${ROUTES.states}/`)
              ? "States"
            : pathname === ROUTES.proVahan ||
              pathname.startsWith(`${ROUTES.proVahan}/`)
              ? "Vahan & Challan"
            : pathname === ROUTES.whatsapp ||
              pathname.startsWith(`${ROUTES.whatsapp}/`)
              ? pathname.includes("/responses")
                ? "Recipients"
                : pathname.includes("/deleted")
                  ? "Deleted WhatsApp"
                  : "WhatsApp"
            : pathname === ROUTES.splitExcel ||
              pathname.startsWith(`${ROUTES.splitExcel}/`)
              ? "Split Excel Files"
            : pathname === ROUTES.vehicleImages ||
              pathname.startsWith(`${ROUTES.vehicleImages}/`)
              ? "Vehicle Image"
            : pathname === ROUTES.pdfImageExtract ||
              pathname.startsWith(`${ROUTES.pdfImageExtract}/`)
              ? "PDF image extract"
            : pathname === ROUTES.archiveEvents ||
              pathname.startsWith(`${ROUTES.archiveEvents}/`)
              ? pathname.includes("/vehicles")
                ? "Archived Vehicles"
                : pathname.includes("/terms")
                  ? "Archived T&C Users"
                  : "Archive Events"
            : pathname === ROUTES.eventsTypes ||
              pathname.startsWith(`${ROUTES.eventsTypes}/`)
              ? "Vehicle Category"
            : pathname === ROUTES.enquiries ||
              pathname.startsWith(`${ROUTES.enquiries}/`)
              ? "Enquiries"
            : pathname === ROUTES.blog ||
              pathname.startsWith(`${ROUTES.blog}/`)
              ? pathname.includes("/deleted")
                ? "Deleted Blogs"
                : pathname.includes("/add")
                  ? "Add Blog"
                  : pathname.includes("/edit")
                    ? "Edit Blog"
                    : "Blog"
            : pathname === ROUTES.career ||
              pathname.startsWith(`${ROUTES.career}/`)
              ? pathname.includes("/deleted")
                ? "Deleted Careers"
                : pathname.includes("/add")
                  ? "Add Career"
                  : pathname.includes("/edit")
                    ? "Edit Career"
                    : pathname.includes("/applications")
                      ? "Job Applications"
                      : "Careers"
            : pathname === ROUTES.jobs ||
              pathname.startsWith(`${ROUTES.jobs}/`)
              ? pathname === ROUTES.jobs
                ? "Job Applications"
                : "Application Details"
            : pathname === ROUTES.scheduleCalls ||
              pathname.startsWith(`${ROUTES.scheduleCalls}/`)
              ? pathname.includes("/deleted")
                ? "Deleted Scheduled Calls"
                : "Scheduled Calls"
            : pathname === ROUTES.auditLogs
              ? "Audit Logs"
              : pathname.startsWith("/user-audit-logs/")
                ? "User Audit Logs"
            : pathname === ROUTES.notifications ||
              pathname.startsWith(`${ROUTES.notifications}/`)
              ? pathname.includes("/deleted")
                ? "Deleted Notifications"
                : "Notifications"
            : pathname.startsWith("/user-notifications/")
              ? pathname.includes("/deleted")
                ? "Deleted Notifications"
                : "User Notifications"
            : pathname === ROUTES.blockedDealers ||
              pathname.startsWith(`${ROUTES.blockedDealers}/`)
            ? "Blocked Dealers"
            : pathname.startsWith("/blocked-sellers/")
              ? "Blocked Sellers"
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
