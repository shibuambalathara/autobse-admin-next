"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button, PageContainer } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { ArchiveEventsFilterFields } from "@/modules/archive-events/components/ArchiveEventsFilterFields";
import { useArchiveAcrDownload } from "@/modules/archive-events/hooks/useArchiveAcrDownload";
import { useArchiveEventsList } from "@/modules/archive-events/hooks/useArchiveEventsList";
import { createArchiveEventsTableColumns } from "@/modules/archive-events/tables/archive-events-table-columns";
import { useEventFilterOptions } from "@/modules/events/hooks/useEventFilterOptions";

export function ArchiveEventsListView() {
  const list = useArchiveEventsList();
  const filterOptions = useEventFilterOptions();
  const { downloadArchiveAcr, loadingEventId } = useArchiveAcrDownload();

  const columns = useMemo(
    () =>
      createArchiveEventsTableColumns({
        sellerOptions: filterOptions.sellerOptions,
        locationOptions: filterOptions.locationOptions,
        vehicleCategoryOptions: filterOptions.vehicleCategoryOptions,
        onDownloadAcr: (event, sellerName, locationName) =>
          downloadArchiveAcr({
            eventId: event.id,
            eventNo: event.eventNo,
            sellerName,
            locationName,
          }),
        acrLoadingEventId: loadingEventId,
      }),
    [downloadArchiveAcr, filterOptions, loadingEventId]
  );

  const showInitialLoading = list.loading && list.events.length === 0;
  const hasFilters = Boolean(list.locationId || list.sellerId || list.searchQuery);

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Archived Events"
        description="Browse archived auction events, download ACR reports, and view archived vehicles."
        actions={
          <Link href={ROUTES.events} className="hidden lg:inline-flex">
            <Button type="button" size="sm" variant="outline">
              <ArrowLeft className="h-4 w-4 shrink-0" />
              Back to Events
            </Button>
          </Link>
        }
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <ArchiveEventsFilterFields
            locationId={list.locationId}
            sellerId={list.sellerId}
            locationOptions={filterOptions.locationOptions}
            sellerOptions={filterOptions.sellerOptions}
            onLocationChange={list.setLocationId}
            onSellerChange={list.setSellerId}
          />
          {hasFilters ? (
            <button
              type="button"
              className="text-sm text-brand-600 hover:text-brand-900"
              onClick={list.clearFilters}
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {showInitialLoading ? (
          <LoadingState label="Loading archived events…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load archived events"
            description={extractGraphqlError(list.error).message}
            action={
              <button
                type="button"
                className="text-sm font-medium text-brand-600 hover:text-brand-900"
                onClick={() => list.refetch()}
              >
                Retry
              </button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={list.events}
            isLoading={list.loading}
            variant="users"
            tableMinWidth={2200}
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by event no, seller, location…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No archived events found"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>
    </div>
  );
}
