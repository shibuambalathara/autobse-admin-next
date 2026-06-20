"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { VEHICLE_STATUS_HISTORY_QUERY } from "@/graphql/documents/vehicles";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import { extractGraphqlError } from "@/lib/graphql-errors";
import type { VehicleStatusHistoryItem } from "@/modules/vehicles/types";
import type { TableColumn } from "@/types";

interface VehicleStatusHistoryViewProps {
  vehicleId: string;
}

export function VehicleStatusHistoryView({ vehicleId }: VehicleStatusHistoryViewProps) {
  const { data, loading, error } = useQuery<{
    vehicle: {
      registrationNumber?: string | null;
      loanAgreementNo?: string | null;
      statusVehicle?: VehicleStatusHistoryItem[];
    };
  }>(VEHICLE_STATUS_HISTORY_QUERY, { variables: { where: { id: vehicleId } } });

  const history = data?.vehicle?.statusVehicle ?? [];

  const columns: TableColumn<VehicleStatusHistoryItem>[] = [
    { id: "status", header: "Status", accessor: "status" },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => (row.createdAt ? formatDate(row.createdAt) : "—"),
    },
    {
      id: "createdBy",
      header: "Created By",
      cell: (row) => row.createdBy?.firstName ?? "—",
    },
  ];

  if (error) {
    return (
      <p className="text-destructive">{extractGraphqlError(error).message}</p>
    );
  }

  return (
    <PageContainer
      title="Vehicle Status History"
      description={
        data?.vehicle?.registrationNumber
          ? `${data.vehicle.registrationNumber} (${data.vehicle.loanAgreementNo ?? ""})`
          : undefined
      }
      actions={
        <Link href={ROUTES.vehicleEdit(vehicleId)} className={buttonVariants({ size: "sm", variant: "outline" })}>
          Back to Vehicle
        </Link>
      }
    >
      {loading ? (
        <LoadingState label="Loading status history…" />
      ) : (
        <DataTable
          columns={columns}
          data={history}
          variant="users"
          emptyTitle="No status history"
          emptyDescription="Status changes for this vehicle will appear here."
        />
      )}
    </PageContainer>
  );
}
