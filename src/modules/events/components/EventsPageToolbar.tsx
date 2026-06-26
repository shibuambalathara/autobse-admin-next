"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Archive, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { FilterSlideOver } from "@/components/filters/FilterSlideOver";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import {
  EventsFilterFields,
  type EventsFilterFieldsProps,
} from "@/modules/events/components/EventsFilterFields";

export type EventsPageToolbarProps = EventsFilterFieldsProps & {
  onClear: () => void;
  showAddEvent?: boolean;
};

function countActiveFilters(props: EventsFilterFieldsProps) {
  let count = 0;
  if (props.startDate) count += 1;
  if (props.eventCategory) count += 1;
  if (props.status) count += 1;
  if (props.locationId) count += 1;
  if (props.sellerId) count += 1;
  if (props.vehicleCategoryId) count += 1;
  return count;
}

const mobileActionButtonClass =
  "box-border flex h-11 w-full max-w-full items-center justify-start gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-left text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50";

export function EventsPageToolbar({
  onClear,
  showAddEvent = true,
  ...fieldProps
}: EventsPageToolbarProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const activeCount = useMemo(() => countActiveFilters(fieldProps), [fieldProps]);

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
        <div className="grid w-full min-w-0 grid-cols-2 gap-2">
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

          <Link
            href={ROUTES.archiveEvents}
            className={cn(mobileActionButtonClass, "justify-center")}
          >
            <Archive className="h-4 w-4 shrink-0" />
            <span className="truncate">Archived</span>
          </Link>
        </div>

        <div className="grid w-full min-w-0 grid-cols-1 gap-2">
          {showAddEvent && (
            <Link
              href={ROUTES.eventsAdd}
              className={cn(
                mobileActionButtonClass,
                "justify-center border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
              )}
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="truncate">Add event</span>
            </Link>
          )}
        </div>

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
        titleId="events-filter-panel-title"
      >
        <EventsFilterFields {...fieldProps} layout="stack" />
      </FilterSlideOver>
    </div>
  );
}
