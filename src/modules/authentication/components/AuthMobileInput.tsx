"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export const AuthMobileInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => (
  <div
    className={cn(
      "flex overflow-hidden rounded-lg border bg-white/[0.04] transition-colors focus-within:border-[#FF6B00]/50 focus-within:ring-1 focus-within:ring-[#FF6B00]/25",
      error ? "border-red-500/60" : "border-white/15"
    )}
  >
    <span className="flex items-center gap-2 border-r border-white/15 px-3 text-sm text-white/50">
      <Phone className="h-4 w-4 shrink-0" />
      +91
    </span>
    <input
      ref={ref}
      type="tel"
      inputMode="numeric"
      className={cn(
        "min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none",
        className
      )}
      {...props}
    />
  </div>
));

AuthMobileInput.displayName = "AuthMobileInput";
