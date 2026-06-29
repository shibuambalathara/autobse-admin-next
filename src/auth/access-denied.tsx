"use client";

import { ShieldX } from "lucide-react";
import { EmptyState } from "@/components/feedback";
import { DefaultHomeLink } from "@/components/routing/DefaultHomeLink";

interface AccessDeniedProps {
  title?: string;
  description?: string;
}

export function AccessDenied({
  title = "Access denied",
  description = "You do not have permission to view this page.",
}: AccessDeniedProps) {
  return (
    <EmptyState
      icon={<ShieldX className="h-6 w-6" />}
      title={title}
      description={description}
      action={<DefaultHomeLink variant="primary" />}
    />
  );
}
