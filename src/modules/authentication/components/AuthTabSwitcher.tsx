"use client";

import { cn } from "@/lib/utils";
import type { AuthMethod } from "@/modules/authentication/types";

interface AuthTabSwitcherProps {
  active: AuthMethod;
  onChange: (method: AuthMethod) => void;
}

const tabs: { id: AuthMethod; label: string }[] = [
  { id: "password", label: "Password" },
  { id: "otp", label: "OTP" },
];

export function AuthTabSwitcher({ active, onChange }: AuthTabSwitcherProps) {
  return (
    <div
      className="grid grid-cols-2 gap-1 rounded-lg bg-surface-muted p-1"
      role="tablist"
      aria-label="Sign in method"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "rounded-md px-3 py-2.5 text-sm font-medium transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
              isActive
                ? "bg-white text-brand-900 shadow-sm"
                : "text-brand-500 hover:text-brand-700"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
