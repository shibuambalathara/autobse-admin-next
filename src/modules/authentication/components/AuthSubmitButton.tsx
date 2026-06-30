"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AuthSubmitButtonProps {
  children: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
}

export function AuthSubmitButton({
  children,
  isLoading,
  loadingText = "Please wait…",
  className,
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      isLoading={isLoading}
      loadingText={loadingText}
      className={cn(
        "h-12 w-full rounded-lg bg-[#FF6B00] text-base font-semibold text-white hover:bg-[#e86200]",
        className
      )}
    >
      {!isLoading && (
        <>
          {children}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
