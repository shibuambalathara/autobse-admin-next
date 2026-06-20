"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { ROUTES } from "@/constants";
import { useAuth } from "@/auth/use-auth";
import { cn } from "@/lib/utils";

export function ProfileDropdown() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.firstName ?? "User";
  const role = user?.role ?? "—";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-brand-700 hover:bg-brand-50"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:block">
          <span className="block text-left font-medium leading-tight">
            {displayName}
          </span>
          <span className="block text-left text-xs capitalize text-brand-400">
            {role}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "hidden h-4 w-4 text-brand-400 transition-transform sm:block",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1 w-48 rounded-md border border-surface-border bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-brand-700 hover:bg-brand-50"
            onClick={() => {
              setOpen(false);
              router.push(ROUTES.settings);
            }}
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-brand-700 hover:bg-brand-50"
            onClick={() => {
              setOpen(false);
              router.push(ROUTES.settings);
            }}
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <hr className="my-1 border-surface-border" />
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
