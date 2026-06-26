"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Archive, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { FilterSlideOver } from "@/components/filters/FilterSlideOver";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import {
  CrmFilterFields,
  type CrmFilterFieldsProps,
} from "@/modules/crm/components/CrmFilterFields";
import type { CrmPageFilters } from "@/modules/crm/types";

export type CrmPageToolbarProps = CrmFilterFieldsProps & {
  onClear: () => void;
  deletedHref?: string;
  showListActions?: boolean;
};

function countActiveFilters(filters: CrmPageFilters, showAssignedStaff = true) {
  let count = 0;
  if (filters.stateId) count += 1;
  if (filters.locationId) count += 1;
  if (filters.status) count += 1;
  if (filters.buyerPreference) count += 1;
  if (filters.vehicleCategoryId) count += 1;
  if (showAssignedStaff && filters.assignedStaffId) count += 1;
  if (filters.nextFollowUpAt) count += 1;
  return count;
}

const mobileActionButtonClass =
  "box-border flex h-11 w-full max-w-full items-center justify-start gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-left text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50";

export function CrmPageToolbar({
  onClear,
  deletedHref = ROUTES.crmDeleted,
  showListActions = true,
  filters,
  showAssignedStaff = true,
  ...fieldProps
}: CrmPageToolbarProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const activeCount = useMemo(
    () => countActiveFilters(filters, showAssignedStaff),
    [filters, showAssignedStaff]
  );

  const filterStatus =
    activeCount > 0 ? (
      <button
        type="button"
        onClick={onClear}
        className="text-sm text-brand-600 hover:text-brand-900"
      >
        {activeCount} filter{activeCount === 1 ? "" : "s"} applied · Clear
      </button>
    ) : (
      <span className="text-sm text-brand-500">No filters applied</span>
    );

  return (
    <div className="mb-4 w-full min-w-0 max-w-full">
      <div className="w-full min-w-0 space-y-3 lg:hidden">
        <div
          className={cn(
            "grid w-full min-w-0 gap-2",
            showListActions ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          <button
            type="button"
            className={cn(mobileActionButtonClass, "justify-center border-neutral-900")}
            onClick={() => setIsPanelOpen(true)}
          >
            <Filter className="h-4 w-4 shrink-0" />
            <span className="truncate">Filters</span>
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 px-1.5 text-xs text-white">
                {activeCount}
              </span>
            )}
          </button>

          {showListActions && (
            <Link
              href={ROUTES.crmAdd}
              className={cn(
                mobileActionButtonClass,
                "justify-center border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
              )}
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="truncate">Add Lead</span>
            </Link>
          )}
        </div>

        {showListActions && (
          <div className="flex w-full min-w-0 flex-col gap-2">
            <Link href={deletedHref} className={mobileActionButtonClass}>
              <Archive className="h-4 w-4 shrink-0 text-neutral-500" />
              <span className="truncate">Deleted Buyer Leads</span>
            </Link>
          </div>
        )}

        <div>{filterStatus}</div>
      </div>

      <div className="hidden w-full min-w-0 lg:block">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsPanelOpen(true)}
          >
            <Filter className="h-4 w-4 shrink-0" />
            Filters
            {activeCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-900 px-1.5 text-xs text-white">
                {activeCount}
              </span>
            )}
          </Button>
          {filterStatus}
        </div>
      </div>

      <FilterSlideOver
        open={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onClear={onClear}
        activeCount={activeCount}
        titleId="crm-filter-panel-title"
      >
        <CrmFilterFields filters={filters} layout="stack" {...fieldProps} />
      </FilterSlideOver>
    </div>
  );
}
