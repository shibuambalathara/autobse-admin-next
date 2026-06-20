"use client";

import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { RotateCcw } from "lucide-react";
import Swal from "sweetalert2";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import {
  DELETED_VEHICLES_QUERY,
  RESTORE_VEHICLE_MUTATION,
} from "@/graphql/documents/vehicles";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import type { DeletedVehicleListItem } from "@/modules/vehicles/types";
import type { TableColumn } from "@/types";

interface DeletedVehiclesListViewProps {
  eventId: string;
}

export function DeletedVehiclesListView({ eventId }: DeletedVehiclesListViewProps) {
  const { data, loading, refetch } = useQuery<{
    deletedVehicles: DeletedVehicleListItem[];
  }>(DELETED_VEHICLES_QUERY, { variables: { eventId } });

  const [restoreVehicle] = useMutation(RESTORE_VEHICLE_MUTATION);

  const vehicles = data?.deletedVehicles ?? [];
  const eventNo = vehicles[0]?.event?.eventNo;

  const handleRestore = async (vehicle: DeletedVehicleListItem) => {
    const result = await Swal.fire({
      title: "Restore vehicle?",
      html: `Registration No: ${vehicle.registrationNumber ?? ""}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Restore",
    });

    if (!result.isConfirmed) return;

    try {
      await restoreVehicle({ variables: { where: { id: vehicle.id } } });
      await refetch();
      await Swal.fire({
        icon: "success",
        title: "Restored",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  const columns: TableColumn<DeletedVehicleListItem>[] = [
    { id: "lotNumber", header: "Lot Number", accessor: "lotNumber" },
    { id: "loanAgreementNo", header: "Loan Ag.No.", accessor: "loanAgreementNo" },
    { id: "vehicleIndexNo", header: "Vehicle ID", accessor: "vehicleIndexNo" },
    {
      id: "registrationNumber",
      header: "Vehicle Details",
      cell: (row) => row.registrationNumber ?? "—",
    },
    { id: "bidStatus", header: "Bid Status", accessor: "bidStatus" },
    {
      id: "restore",
      header: "Restore",
      cell: (row) => (
        <button
          type="button"
          onClick={() => handleRestore(row)}
          className="inline-flex h-8 items-center justify-center rounded-md bg-emerald-600 px-2 text-white hover:bg-emerald-700"
          title="Restore vehicle"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <PageContainer
      title={`Deleted Vehicles${eventNo != null ? ` — Event No: ${eventNo}` : ""}`}
      description={vehicles[0]?.event?.seller?.name ? `Seller: ${vehicles[0].event.seller.name}` : undefined}
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href={ROUTES.vehicleAdd(eventId)}
            className={buttonVariants({ size: "sm" })}
          >
            Add Vehicle
          </Link>
          <Link
            href={ROUTES.eventVehicles(eventId)}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Back to Vehicles
          </Link>
        </div>
      }
    >
      {loading ? (
        <LoadingState label="Loading deleted vehicles…" />
      ) : (
        <DataTable
          columns={columns}
          data={vehicles}
          variant="users"
          emptyTitle="No deleted vehicles"
          emptyDescription="Deleted vehicles for this event will appear here."
        />
      )}
    </PageContainer>
  );
}
