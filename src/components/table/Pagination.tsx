"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Select } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { PaginationState } from "@/types";

interface PaginationProps {
  state: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

const MAX_VISIBLE_PAGES = 5;

function getVisiblePages(page: number, totalPages: number): number[] {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const startIndex = Math.max(
    0,
    Math.min(page - 1 - 2, totalPages - MAX_VISIBLE_PAGES)
  );

  return Array.from(
    { length: MAX_VISIBLE_PAGES },
    (_, index) => startIndex + index + 1
  );
}

export function Pagination({
  state,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: PaginationProps) {
  const { page, pageSize, total } = state;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const visiblePages = getVisiblePages(page, totalPages);
  const lastVisiblePage = visiblePages[visiblePages.length - 1] ?? page;
  const showLastPageJump =
    totalPages > MAX_VISIBLE_PAGES &&
    page < totalPages - 1 &&
    lastVisiblePage < totalPages;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      <p className="text-sm text-brand-500">
        Showing{" "}
        <span className="font-medium text-brand-800">{from}</span> to{" "}
        <span className="font-medium text-brand-800">{to}</span> of{" "}
        <span className="font-medium text-brand-800">{total}</span> entries
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-brand-500">Rows</span>
            <Select
              className="w-20"
              value={String(pageSize)}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              options={pageSizeOptions.map((n) => ({
                label: String(n),
                value: String(n),
              }))}
              aria-label="Rows per page"
            />
          </div>
        )}

        <nav
          aria-label="Pagination"
          className="flex flex-wrap items-center justify-center gap-1"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="mr-1"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {visiblePages.map((pageNumber) => (
            <Button
              key={pageNumber}
              type="button"
              variant={pageNumber === page ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === page ? "page" : undefined}
              className={cn(
                "min-w-9 px-3",
                pageNumber === page && "font-semibold"
              )}
            >
              {pageNumber}
            </Button>
          ))}

          {showLastPageJump && (
            <>
              <span className="px-2 text-sm text-brand-400" aria-hidden>
                …
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                aria-label={`Page ${totalPages}`}
                className="min-w-9 px-3"
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="ml-1"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </div>
  );
}
