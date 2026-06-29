"use client";

import Link from "next/link";
import { useAuth } from "@/auth/use-auth";
import {
  getDefaultHomeLabel,
  getPostLoginRoute,
} from "@/auth/default-route";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/utils";

interface DefaultHomeLinkProps {
  variant?: "primary" | "outline";
  className?: string;
}

export function DefaultHomeLink({
  variant = "outline",
  className,
}: DefaultHomeLinkProps) {
  const { user } = useAuth();
  const href = getPostLoginRoute(user?.role);
  const label = getDefaultHomeLabel(user?.role);

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          size: "sm",
          variant: variant === "primary" ? "primary" : "outline",
        }),
        className
      )}
    >
      {label}
    </Link>
  );
}
