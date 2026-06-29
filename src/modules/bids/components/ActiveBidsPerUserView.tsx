"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { ACTIVE_BIDS_PER_USER_QUERY } from "@/graphql/documents/bids";
import { CREATE_VEHICLE_STATUS_MUTATION } from "@/graphql/documents/vehicles";
import { ROUTES } from "@/constants/routes";
import { useAccess } from "@/auth/use-access";
import { PERMISSIONS } from "@/auth/permissions";
import { formatDate } from "@/lib/date-format";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { VEHICLE_BID_STATUS } from "@/modules/bids/constants";
import type { ActiveBidVehicle } from "@/modules/bids/types";
import type { TableColumn } from "@/types";

interface ActiveBidsPerUserViewProps {
  userId: string;
}

export function ActiveBidsPerUserView({ userId }: ActiveBidsPerUserViewProps) {
  const { can } = useAccess();
  const canManageBids = can(PERMISSIONS.BIDS_MANAGE);
  const { data, loading, refetch } = useQuery<{
    user: {
      firstName?: string | null;
      lastName?: string | null;
      activeBids?: ActiveBidVehicle[];
    };
  }>(ACTIVE_BIDS_PER_USER_QUERY, { variables: { where: { id: userId } } });

  const [updateVehicleStatus] = useMutation(CREATE_VEHICLE_STATUS_MUTATION);

  const user = data?.user;
  const bids = user?.activeBids ?? [];

  const handleDecline = useCallback(async (vehicle: ActiveBidVehicle) => {
    const result = await Swal.fire({
      title: "Decline bid?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, decline",
    });
    if (!result.isConfirmed) return;

    try {
      await updateVehicleStatus({
        variables: {
          vehicleId: vehicle.id,
          createVehicleStatusInput: { status: VEHICLE_BID_STATUS.DECLINED },
        },
      });
      await refetch();
      await Swal.fire({
        icon: "success",
        title: "Declined",
        text: vehicle.currentBidAmount
          ? `Buying limit increased by ₹${vehicle.currentBidAmount.toLocaleString()}`
          : undefined,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  }, [refetch, updateVehicleStatus]);

  const handleFulfill = useCallback(async (vehicle: ActiveBidVehicle) => {
    const result = await Swal.fire({
      title: "Fulfill bid?",
      html: "Generate winning letter and mark bid as fulfilled.<br><span style='color:red'>Once fulfilled, bid status cannot be changed.</span>",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, fulfill",
    });
    if (!result.isConfirmed) return;

    try {
      await updateVehicleStatus({
        variables: {
          vehicleId: vehicle.id,
          createVehicleStatusInput: { status: VEHICLE_BID_STATUS.FULL_FILLED },
        },
      });
      await refetch();
      await Swal.fire({
        icon: "success",
        title: "Fulfilled",
        text: "Bid status updated to fulfilled.",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  }, [refetch, updateVehicleStatus]);

  const columns = useMemo(
    (): TableColumn<ActiveBidVehicle>[] => [
      { id: "eventNo", header: "Event No", cell: (row) => row.event?.eventNo ?? "—" },
      { id: "registrationNumber", header: "Reg No", accessor: "registrationNumber" },
      { id: "vehicleIndexNo", header: "Lot No", accessor: "vehicleIndexNo" },
      { id: "startBidAmount", header: "Start Price", accessor: "startBidAmount" },
      { id: "currentBidAmount", header: "Current Bid", accessor: "currentBidAmount" },
      {
        id: "createdAt",
        header: "Created At",
        cell: (row) => (row.createdAt ? formatDate(row.createdAt) : "—"),
      },
      {
        id: "updatedAt",
        header: "Updated At",
        cell: (row) => (row.updatedAt ? formatDate(row.updatedAt) : "—"),
      },
      {
        id: "bidTimeExpire",
        header: "Bid End Time",
        cell: (row) => (row.bidTimeExpire ? formatDate(row.bidTimeExpire) : "—"),
      },
      { id: "bidStatus", header: "Bid Status", accessor: "bidStatus" },
      ...(canManageBids
        ? [
            {
              id: "decline",
              header: "Decline",
              cell: (row: ActiveBidVehicle) => (
                <button
                  type="button"
                  onClick={() => handleDecline(row)}
                  className="inline-flex h-8 items-center rounded-md bg-red-600 px-2 text-sm text-white hover:bg-red-700"
                >
                  Decline
                </button>
              ),
            } satisfies TableColumn<ActiveBidVehicle>,
          ]
        : []),
      {
        id: "vehicle",
        header: "Vehicle Details",
        cell: (row) => (
          <Link
            href={ROUTES.vehicleEdit(row.id)}
            className="inline-flex h-8 items-center rounded-md bg-slate-800 px-2 text-sm text-white hover:bg-slate-900"
          >
            {row.registrationNumber ?? "View"}
          </Link>
        ),
      },
      {
        id: "event",
        header: "View Event",
        cell: (row) =>
          row.event?.id ? (
            <Link
              href={ROUTES.eventEdit(row.event.id)}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              View Event
            </Link>
          ) : (
            "—"
          ),
      },
      ...(canManageBids
        ? [
            {
              id: "fulfill",
              header: "Winning Letter",
              cell: (row: ActiveBidVehicle) =>
                row.bidStatus === VEHICLE_BID_STATUS.FULL_FILLED ? (
                  <span className="text-sm text-muted-foreground">Fulfilled</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleFulfill(row)}
                    className="inline-flex h-8 items-center rounded-md bg-slate-800 px-2 text-sm text-white hover:bg-slate-900"
                  >
                    Click to Fulfill
                  </button>
                ),
            } satisfies TableColumn<ActiveBidVehicle>,
          ]
        : []),
    ],
    [canManageBids, handleDecline, handleFulfill]
  );

  return (
    <PageContainer
      title={`Bids of ${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()}
      actions={
        <Link
          href={ROUTES.bidsArchivePerUser(userId)}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          Show Bid Archive
        </Link>
      }
    >
      {loading ? (
        <LoadingState label="Loading active bids…" />
      ) : (
        <DataTable
          columns={columns}
          data={bids}
          tableMinWidth={2200}
          variant="users"
          emptyTitle="No active bids"
          emptyDescription="This user has no active bids."
        />
      )}
    </PageContainer>
  );
}
