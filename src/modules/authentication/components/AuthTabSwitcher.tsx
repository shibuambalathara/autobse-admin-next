"use client";

import { KeyRound, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthMethod } from "@/modules/authentication/types";

interface AuthTabSwitcherProps {
  active: AuthMethod;
  onChange: (method: AuthMethod) => void;
}

const tabs: {
  id: AuthMethod;
  label: string;
  icon: typeof KeyRound;
}[] = [
  { id: "password", label: "Password", icon: KeyRound },
  { id: "otp", label: "OTP", icon: Smartphone },
];

export function AuthTabSwitcher({ active, onChange }: AuthTabSwitcherProps) {
  return (
    <div
      className="flex border-b border-white/10"
      role="tablist"
      aria-label="Sign in method"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50",
              isActive
                ? "border-[#FF6B00] text-white"
                : "border-transparent text-white/45 hover:text-white/70"
            )}
          >
            <Icon
              className={cn("h-4 w-4", isActive ? "text-[#FF6B00]" : "text-white/40")}
            />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
