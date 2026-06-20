"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import Swal from "sweetalert2";
import { PageContainer, Button, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { APP_ROLES } from "@/auth/roles";
import { useAccess } from "@/auth/use-access";
import { ChangeVehicleStatusModal } from "@/modules/event-vehicles/components/ChangeVehicleStatusModal";
import { UpdateBidTimeModal } from "@/modules/event-vehicles/components/UpdateBidTimeModal";
import { VEHICLE_LEGACY_ROUTES } from "@/modules/event-vehicles/constants";
import { useEventVehiclesList } from "@/modules/event-vehicles/hooks/useEventVehiclesList";
import { useEventVehicleRowActions } from "@/modules/event-vehicles/hooks/useEventVehicleRowActions";
import { createEventVehiclesTableColumns } from "@/modules/event-vehicles/tables/event-vehicles-table-columns";
import type { EventVehicleListItem } from "@/modules/event-vehicles/types";

interface EventVehiclesListViewProps {
  eventId: string;
  eventCategory?: string | null;
}

export function EventVehiclesListView({
  eventId,
  eventCategory,
}: EventVehiclesListViewProps) {
  const { role } = useAccess();
  const isAdmin = role?.toLowerCase() === APP_ROLES.ADMIN;
  const list = useEventVehiclesList(eventId);
  const rowActions = useEventVehicleRowActions(() => list.refetch());

  const resolvedCategory = eventCategory ?? list.event?.eventCategory ?? "";

  const handleBidNow = useCallback(async (_vehicle: EventVehicleListItem) => {
    await Swal.fire({
      icon: "info",
      title: "Bid modal",
      text: "Live bidding UI is not yet migrated. Use the legacy panel for bidding.",
    });
  }, []);

  const columns = useMemo(
    () =>
      createEventVehiclesTableColumns({
        eventCategory: resolvedCategory,
        isAdmin,
        onDelete: rowActions.handleDelete,
        onAboutBid: rowActions.handleAboutBid,
        onChangeStatus: rowActions.openChangeStatus,
        onBidTimeEdit: rowActions.setBidTimeUpdate,
        onBidNow: handleBidNow,
      }),
    [handleBidNow, isAdmin, resolvedCategory, rowActions]
  );

  const toolbarActions = (
    <div className="flex flex-wrap gap-2">
      {list.isEventActive && (
        <a
          href={VEHICLE_LEGACY_ROUTES.addVehicle(eventId)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </a>
      )}
      <a
        href={VEHICLE_LEGACY_ROUTES.deletedBids(eventId)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ size: "sm", variant: "outline" })}
      >
        Deleted Bids
      </a>
      <a
        href={VEHICLE_LEGACY_ROUTES.deletedVehicles(eventId)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ size: "sm", variant: "outline" })}
      >
        Deleted Vehicles
      </a>
      <Link href={ROUTES.events} className={buttonVariants({ size: "sm", variant: "outline" })}>
        Back to Events
      </Link>
    </div>
  );

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title={`Vehicles of Event No: ${list.event?.eventNo ?? "—"}`}
        description={
          list.event?.seller?.name
            ? `Seller: ${list.event.seller.name}`
            : undefined
        }
        actions={toolbarActions}
      >
        {list.loading && list.vehicles.length === 0 ? (
          <LoadingState label="Loading vehicles…" />
        ) : (
          <DataTable
            columns={columns}
            data={list.vehicles}
            tableMinWidth={2800}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Quick search…"
            toolbarActions={
              list.searchInput ? (
                <Button type="button" size="sm" variant="outline" onClick={list.clearFilters}>
                  Clear
                </Button>
              ) : undefined
            }
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No vehicles found"
            emptyDescription="Try adjusting your search."
          />
        )}
      </PageContainer>

      <ChangeVehicleStatusModal
        open={rowActions.statusModalOpen}
        vehicleId={rowActions.statusVehicleId}
        currentBidStatus={rowActions.statusVehicleBidStatus}
        onClose={() => rowActions.setStatusModalOpen(false)}
        onSubmit={rowActions.handleChangeStatus}
      />

      <UpdateBidTimeModal
        update={rowActions.bidTimeUpdate}
        onClose={() => rowActions.setBidTimeUpdate(null)}
        onSave={rowActions.handleBidTimeUpdate}
      />
    </div>
  );
}
