"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export const AuthPasswordInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
>(({ className, error, ...props }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={cn(
        "relative flex overflow-hidden rounded-lg border bg-white/[0.04] transition-colors focus-within:border-[#FF6B00]/50 focus-within:ring-1 focus-within:ring-[#FF6B00]/25",
        error ? "border-red-500/60" : "border-white/15"
      )}
    >
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn(
          "w-full bg-transparent px-3 py-3 pr-11 text-sm text-white placeholder:text-white/35 focus:outline-none",
          className
        )}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-0 top-0 flex h-full items-center px-3 text-white/40 transition-colors hover:text-white/70"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});

AuthPasswordInput.displayName = "AuthPasswordInput";
