"use client";

import { cn } from "@/lib/utils";
import { Pagination } from "@/components/table/Pagination";
import { TableToolbar } from "@/components/table/TableToolbar";
import { DataTableCardView } from "@/components/table/DataTableCardView";
import { DataTableScrollView } from "@/components/table/DataTableScrollView";
import type {
  PaginationState,
  TableColumn,
  TableFilter,
  TableResponsiveMode,
} from "@/types";
import type { DataTableVariant } from "@/components/table/DataTableScrollView";

export interface DataTableProps<T extends { id: string }> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: TableFilter[];
  onFilterChange?: (filterId: string, value: string) => void;
  toolbarActions?: React.ReactNode;
  className?: string;
  /** Minimum table width for horizontal scroll on all screen sizes. */
  tableMinWidth?: number | string;
  /**
   * `scroll` (default) — responsive table with horizontal scroll on every device
   * `auto` — same as `scroll`
   * `cards` — optional stacked card rows (not a table)
   */
  responsive?: TableResponsiveMode;
  mobileScrollHint?: string;
  variant?: DataTableVariant;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  emptyTitle,
  emptyDescription,
  pagination,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  onFilterChange,
  toolbarActions,
  className,
  tableMinWidth = 640,
  responsive = "scroll",
  mobileScrollHint,
  variant = "default",
}: DataTableProps<T>) {
  const hasToolbar = onSearchChange || filters?.length || toolbarActions;
  const useCardView = responsive === "cards";

  return (
    <div className={cn("w-full min-w-0 max-w-full space-y-4", className)}>
      {hasToolbar && (
        <TableToolbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          filters={filters}
          onFilterChange={onFilterChange}
          actions={toolbarActions}
        />
      )}

      <div
        className={cn(
          "w-full min-w-0 max-w-full overflow-hidden bg-white",
          variant === "users"
            ? "rounded-lg border border-[#e8e0d4]"
            : "rounded-lg border border-surface-border shadow-card"
        )}
      >
        {useCardView ? (
          <DataTableCardView
            columns={columns}
            data={data}
            isLoading={isLoading}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
          />
        ) : (
          <DataTableScrollView
            columns={columns}
            data={data}
            isLoading={isLoading}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            tableMinWidth={tableMinWidth}
            scrollHint={mobileScrollHint}
            showScrollHint
            variant={variant}
          />
        )}

        {pagination && onPageChange && (
          <div className="border-t border-surface-border px-4 py-4">
            <Pagination
              state={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
