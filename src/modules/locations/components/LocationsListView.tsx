"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PERMISSIONS } from "@/auth/permissions";
import { useAccess } from "@/auth/use-access";
import { Button, PageContainer } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { LocationsFilterFields } from "@/modules/locations/components/LocationsFilterFields";
import { LocationsPageToolbar } from "@/modules/locations/components/LocationsPageToolbar";
import { AddLocationModal } from "@/modules/locations/components/modals/AddLocationModal";
import { EditLocationModal } from "@/modules/locations/components/modals/EditLocationModal";
import { useLocationsList } from "@/modules/locations/hooks/useLocationsList";
import { createLocationsTableColumns } from "@/modules/locations/tables/locations-table-columns";
import type { Location } from "@/modules/locations/types";

export function LocationsListView() {
  const { can } = useAccess();
  const canManage = can(PERMISSIONS.LOCATIONS_MANAGE);

  const list = useLocationsList();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const columns = useMemo(
    () =>
      createLocationsTableColumns({
        canManage,
        onEdit: (location) => {
          setSelectedLocation(location);
          setEditModalOpen(true);
        },
      }),
    [canManage]
  );

  const showInitialLoading = list.loading && list.locations.length === 0;

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Locations"
        description="Manage cities and states used across events, calendars, and CRM."
        actions={
          canManage ? (
            <div className="hidden lg:flex">
              <Button size="sm" onClick={() => setAddModalOpen(true)}>
                <Plus className="h-4 w-4 shrink-0" />
                Add Location
              </Button>
            </div>
          ) : undefined
        }
      >
        <LocationsPageToolbar
          canManage={canManage}
          onAdd={() => setAddModalOpen(true)}
        />

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <LocationsFilterFields
            stateFilter={list.stateFilter}
            onStateChange={list.setStateFilter}
          />
          {list.stateFilter || list.searchQuery ? (
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
          <LoadingState label="Loading locations…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load locations"
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
            data={list.locations}
            isLoading={list.loading}
            variant="users"
            tableMinWidth={800}
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by city or state…"
            pagination={
              list.isSearching
                ? undefined
                : {
                    page: list.page,
                    pageSize: list.pageSize,
                    total: list.total,
                  }
            }
            onPageChange={list.setPage}
            emptyTitle="No locations found"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>

      <AddLocationModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => list.refetch()}
      />

      <EditLocationModal
        open={editModalOpen}
        location={selectedLocation}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedLocation(null);
        }}
        onSuccess={() => list.refetch()}
      />
    </div>
  );
}
