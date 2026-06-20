"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarNav } from "@/components/layout/SidebarNav";
import type { NavItem } from "@/types";

interface SidebarProps {
  items: NavItem[];
  collapsed?: boolean;
  className?: string;
}

export function Sidebar({ items, collapsed, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-brand-900 text-white",
        collapsed ? "w-sidebar-collapsed" : "w-sidebar",
        className
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-brand-800 px-4",
          collapsed && "justify-center px-2"
        )}
      >
        {collapsed ? (
          <span className="text-lg font-bold text-white">
            A<span className="text-orange-400">B</span>
          </span>
        ) : (
          <span className="text-lg font-bold text-white">
            AUTO<span className="text-orange-400">BSE</span>
          </span>
        )}
      </div>
      <SidebarNav items={items} collapsed={collapsed} />
    </aside>
  );
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
}

export function MobileDrawer({ open, onClose, items }: MobileDrawerProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-drawer bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-drawer w-sidebar transform bg-brand-900 transition-transform duration-200 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="flex h-14 items-center justify-between border-b border-brand-800 px-4">
          <span className="text-lg font-bold text-white">
            AUTO<span className="text-orange-400">BSE</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-brand-200 hover:bg-brand-800 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarNav items={items} onNavigate={onClose} />
      </aside>
    </>
  );
}
