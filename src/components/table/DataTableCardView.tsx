"use client";

import { cn } from "@/lib/utils";
import { EmptyState, TableSkeleton } from "@/components/feedback";
import {
  getCellContent,
  partitionMobileColumns,
} from "@/components/table/table-utils";
import type { TableColumn } from "@/types";

interface DataTableCardViewProps<T extends { id: string }> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTableCardView<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  emptyTitle,
  emptyDescription,
}: DataTableCardViewProps<T>) {
  const { primary, body, footer } = partitionMobileColumns(columns);

  if (isLoading) {
    return (
      <div className="p-4">
        <TableSkeleton />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-4">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="divide-y divide-surface-border">
      {data.map((row) => (
        <article
          key={row.id}
          className="space-y-3 px-4 py-4"
          aria-label={primary ? `${primary.header} ${getCellContent(primary, row)}` : undefined}
        >
          {primary && (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                  {primary.header}
                </p>
                <p className="mt-1 truncate text-base font-semibold text-brand-900">
                  {getCellContent(primary, row)}
                </p>
              </div>
            </div>
          )}

          {body.length > 0 && (
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {body.map((column) => (
                <div key={column.id} className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-brand-500">
                    {column.header}
                  </dt>
                  <dd
                    className={cn(
                      "mt-1 break-words text-sm text-brand-800",
                      column.className
                    )}
                  >
                    {getCellContent(column, row)}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {footer.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-surface-border pt-3">
              {footer.map((column) => (
                <div
                  key={column.id}
                  className="flex min-w-0 items-center gap-2"
                  aria-label={column.header}
                >
                  <span className="sr-only">{column.header}</span>
                  {getCellContent(column, row)}
                </div>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
