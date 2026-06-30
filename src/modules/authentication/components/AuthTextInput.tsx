"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const AuthTextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-lg border bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#FF6B00]/50 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]/25",
      error ? "border-red-500/60" : "border-white/15",
      className
    )}
    {...props}
  />
));

AuthTextInput.displayName = "AuthTextInput";
