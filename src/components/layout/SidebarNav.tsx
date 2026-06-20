"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  hasActiveChild,
  isRouteActive,
} from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface SidebarNavProps {
  items: NavItem[];
  collapsed?: boolean;
  onNavigate?: () => void;
}

function NavLink({
  item,
  collapsed,
  pathname,
  depth = 0,
  onNavigate,
}: {
  item: NavItem;
  collapsed?: boolean;
  pathname: string;
  depth?: number;
  onNavigate?: () => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const active = isRouteActive(item.href, pathname);
  const childActive = hasActiveChild(item, pathname);
  const [expanded, setExpanded] = useState(childActive);
  const Icon = item.icon;

  useEffect(() => {
    if (childActive) setExpanded(true);
  }, [childActive]);

  if (hasChildren) {
    const rowActive = active || childActive;

    return (
      <div>
        <div
          className={cn(
            "flex w-full items-center rounded-md transition-colors",
            rowActive
              ? "bg-brand-800 text-white"
              : "text-brand-200 hover:bg-brand-800/60 hover:text-white"
          )}
        >
          <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? item.label : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <span className="flex-1 truncate text-left">{item.label}</span>
            )}
          </Link>

          {!collapsed && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mr-1 rounded-md p-1 text-brand-200 transition-colors hover:bg-brand-700/60 hover:text-white"
              aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label} menu`}
              aria-expanded={expanded}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
            </button>
          )}
        </div>

        {!collapsed && expanded && (
          <div className="ml-3 mt-1 space-y-0.5 border-l border-brand-700 pl-3">
            {item.children!.map((child) => (
              <NavLink
                key={child.id}
                item={child}
                collapsed={collapsed}
                pathname={pathname}
                depth={depth + 1}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-brand-800 text-white"
          : "text-brand-200 hover:bg-brand-800/60 hover:text-white",
        collapsed && "justify-center px-2",
        depth > 0 && "text-sm"
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export function SidebarNav({ items, collapsed, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4"
        aria-label="Main navigation"
      />
    );
  }

  return (
    <nav
      className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4"
      aria-label="Main navigation"
    >
      {items.map((item) => (
        <NavLink
          key={item.id}
          item={item}
          collapsed={collapsed}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
