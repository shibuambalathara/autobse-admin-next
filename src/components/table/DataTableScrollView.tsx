"use client";

import { cn } from "@/lib/utils";
import { EmptyState, TableSkeleton } from "@/components/feedback";
import { getCellContent, getCellText } from "@/components/table/table-utils";
import type { TableColumn } from "@/types";

export type DataTableVariant = "default" | "users";

interface DataTableScrollViewProps<T extends { id: string }> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  tableMinWidth?: number | string;
  showScrollHint?: boolean;
  scrollHint?: string;
  variant?: DataTableVariant;
}

export function DataTableScrollView<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  emptyTitle,
  emptyDescription,
  tableMinWidth = 640,
  showScrollHint = true,
  scrollHint = "Scroll right for more columns · first column stays fixed",
  variant = "default",
}: DataTableScrollViewProps<T>) {
  const isUsersVariant = variant === "users";

  const scrollHintEl = showScrollHint ? (
    <p
      className={cn(
        "px-3 py-2.5 text-center text-xs text-brand-500 lg:hidden",
        isUsersVariant
          ? "border-t border-[#e8e0d4] bg-white"
          : "border-b border-surface-border bg-surface-muted"
      )}
    >
      {scrollHint}
    </p>
  ) : null;

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      {!isUsersVariant && scrollHintEl}

      <div
        className="w-full max-w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]"
        style={{ scrollbarWidth: "thin" }}
      >
        <table
          className={cn(
            "w-full border-collapse text-sm",
            isUsersVariant && "border border-[#e8e0d4]"
          )}
          style={{ minWidth: tableMinWidth }}
        >
          <thead
            className={cn(
              "sticky top-0 z-10",
              isUsersVariant ? "bg-[#ebe4d6]" : "bg-surface-muted"
            )}
          >
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    "whitespace-nowrap px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide",
                    isUsersVariant
                      ? "border border-[#e8e0d4] text-neutral-700"
                      : "border-b border-surface-border text-brand-600",
                    column.sticky &&
                      cn(
                        "sticky left-0 z-20 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]",
                        isUsersVariant ? "bg-[#ebe4d6]" : "bg-surface-muted"
                      ),
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-4">
                  <TableSkeleton />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="bg-white">
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        "whitespace-nowrap px-3 py-3 text-brand-800",
                        isUsersVariant && "border border-[#e8e0d4] text-sm",
                        column.sticky &&
                          cn(
                            "sticky left-0 z-10 bg-white shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]",
                            column.id === "idNo" && "font-bold text-neutral-900"
                          ),
                        !column.sticky && "max-w-[200px] truncate",
                        column.className
                      )}
                      title={getCellText(column, row) || undefined}
                    >
                      {getCellContent(column, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isUsersVariant && scrollHintEl}
    </div>
  );
}
