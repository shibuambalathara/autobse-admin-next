import { ROUTES } from "@/constants";
import Link from "next/link";
import { PageContainer } from "@/components/ui";

export default function NotFound() {
  return (
    <PageContainer
      title="Page not found"
      description="This route has not been migrated from the legacy admin panel yet."
      actions={
        <Link
          href={ROUTES.dashboard}
          className="inline-flex h-9 items-center justify-center rounded-md border border-surface-border bg-white px-4 text-sm font-medium text-brand-800 hover:bg-surface-muted"
        >
          Back to Dashboard
        </Link>
      }
    />
  );
}
