import Link from "next/link";
import { DefaultHomeLink } from "@/components/routing/DefaultHomeLink";
import { PageContainer } from "@/components/ui";

export default function NotFound() {
  return (
    <PageContainer
      title="Page not found"
      description="This route has not been migrated from the legacy admin panel yet."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <DefaultHomeLink />
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-md border border-surface-border bg-white px-4 text-sm font-medium text-brand-800 hover:bg-surface-muted"
          >
            Sign in
          </Link>
        </div>
      }
    />
  );
}
