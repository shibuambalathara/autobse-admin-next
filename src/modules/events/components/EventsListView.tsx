"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Layers, Plus } from "lucide-react";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { EventsPageToolbar } from "@/modules/events/components/EventsPageToolbar";
import { EVENT_LEGACY_ROUTES } from "@/modules/events/constants/related-routes";
import { useEventFilterOptions } from "@/modules/events/hooks/useEventFilterOptions";
import { useEventRowActions } from "@/modules/events/hooks/useEventRowActions";
import { useEventsList } from "@/modules/events/hooks/useEventsList";
import { createEventsTableColumns } from "@/modules/events/tables/events-table-columns";

export function EventsListView() {
  const list = useEventsList();
  const filterOptions = useEventFilterOptions();
  const rowActions = useEventRowActions(() => list.refetch());

  const columns = useMemo(
    () => createEventsTableColumns({ onArchive: rowActions.handleArchive }),
    [rowActions]
  );

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Events"
        description="Manage auction events and schedules."
        actions={
          <div className="hidden flex-wrap gap-2 lg:flex">
            <Link
              href={ROUTES.eventsTypes}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              <Layers className="h-4 w-4 shrink-0" />
              Event Types
            </Link>
            <Link
              href={EVENT_LEGACY_ROUTES.addEvent}
              className={buttonVariants({ size: "sm" })}
            >
              <Plus className="h-4 w-4 shrink-0" />
              Add Event
            </Link>
          </div>
        }
      >
        <EventsPageToolbar
          startDate={list.startDate}
          setStartDate={list.setStartDate}
          eventCategory={list.eventCategory}
          setEventCategory={list.setEventCategory}
          status={list.status}
          setStatus={list.setStatus}
          locationId={list.locationId}
          setLocationId={list.setLocationId}
          sellerId={list.sellerId}
          setSellerId={list.setSellerId}
          vehicleCategoryId={list.vehicleCategoryId}
          setVehicleCategoryId={list.setVehicleCategoryId}
          locationOptions={filterOptions.locationOptions}
          sellerOptions={filterOptions.sellerOptions}
          vehicleCategoryOptions={filterOptions.vehicleCategoryOptions}
          onClear={list.clearFilters}
        />

        {list.loading && list.events.length === 0 ? (
          <LoadingState label="Loading events…" />
        ) : (
          <DataTable
            columns={columns}
            data={list.events}
            tableMinWidth={2200}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by location or seller name…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No events found"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>
    </div>
  );
}
