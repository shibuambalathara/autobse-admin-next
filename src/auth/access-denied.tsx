import { ShieldX } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { EmptyState } from "@/components/feedback";

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
      action={
        <Link
          href={ROUTES.dashboard}
          className="inline-flex h-9 items-center justify-center rounded-md bg-brand-800 px-4 text-sm font-medium text-white hover:bg-brand-900"
        >
          Go to Dashboard
        </Link>
      }
    />
  );
}
