"use client";

import Link from "next/link";
import { useAuth } from "@/auth/use-auth";
import { getPostLoginRoute } from "@/auth/default-route";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  collapsed?: boolean;
  variant?: "light" | "dark";
  className?: string;
}

export function BrandLogo({
  collapsed = false,
  variant = "dark",
  className,
}: BrandLogoProps) {
  const { user } = useAuth();
  const isLight = variant === "light";

  return (
    <Link
      href={getPostLoginRoute(user?.role)}
      className={cn("shrink-0 font-bold leading-none", className)}
      aria-label="AutoBSE home"
    >
      {collapsed ? (
        <span
          className={cn("text-lg", isLight ? "text-white" : "text-brand-900")}
        >
          AUTO<span className="text-orange-400">BSe</span>
        </span>
      ) : (
        <span
          className={cn("text-lg", isLight ? "text-white" : "text-brand-900")}
        >
          AUTO
          <span className={isLight ? "text-orange-400" : "text-orange-500"}>
            BSe
          </span>
        </span>
      )}
    </Link>
  );
}
