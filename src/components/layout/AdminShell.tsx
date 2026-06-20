"use client";

import { getNavigationForRole } from "@/config/navigation";
import { RouteGuard } from "@/auth";
import { useAccess } from "@/auth/use-access";
import { useSidebar } from "@/hooks";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Header, Sidebar, MobileDrawer } from "@/components/layout";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const { role } = useAccess();
  const navItems = getNavigationForRole(role);
  const sidebar = useSidebar();

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0 z-sidebar">
          <Sidebar items={navItems} collapsed={sidebar.isCollapsed} />
        </div>
      </div>

      <MobileDrawer
        open={sidebar.isOpen}
        onClose={sidebar.close}
        items={navItems}
      />

      <div
        className={cn(
          "flex min-h-screen w-full min-w-0 max-w-full flex-1 flex-col overflow-x-hidden transition-[margin] duration-200",
          sidebar.isCollapsed ? "lg:ml-sidebar-collapsed" : "lg:ml-sidebar"
        )}
      >
        <Header
          onMenuToggle={sidebar.toggle}
          onSidebarCollapse={sidebar.toggleCollapse}
          isCollapsed={sidebar.isCollapsed}
          showCollapseToggle
        />
        <main className="w-full min-w-0 max-w-full flex-1 overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6">
          <RouteGuard>
            <Breadcrumbs className="hidden lg:block" />
            {children}
          </RouteGuard>
        </main>
      </div>
    </div>
  );
}
