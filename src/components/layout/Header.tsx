"use client";

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui";
import { BrandLogo } from "@/components/layout/BrandLogo";
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
  const hideLogoOnDesktop = Boolean(showCollapseToggle && !isCollapsed);

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

      <BrandLogo
        collapsed={Boolean(isCollapsed && showCollapseToggle)}
        className={cn(hideLogoOnDesktop && "lg:hidden")}
      />

      <div className="ml-auto flex shrink-0 items-center">
        <ProfileDropdown />
      </div>
    </header>
  );
}
