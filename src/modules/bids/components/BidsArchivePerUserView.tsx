"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { ARCHIVE_BIDS_QUERY } from "@/graphql/documents/bids";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import type { TableColumn } from "@/types";

interface ArchiveBidRow {
  id: string;
  amount?: number | null;
  createdById?: string | null;
  bidVehicle?: {
    id?: string | null;
    registrationNumber?: string | null;
    bidStatus?: string | null;
  } | null;
  user?: {
    id?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    mobile?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
}

interface BidsArchivePerUserViewProps {
  userId: string;
}

export function BidsArchivePerUserView({ userId }: BidsArchivePerUserViewProps) {
  const { data, loading } = useQuery<{ bidsArchive: ArchiveBidRow[] }>(
    ARCHIVE_BIDS_QUERY,
    { variables: { where: { userId } } }
  );

  const bids = useMemo(
    () =>
      (data?.bidsArchive ?? []).map((bid, index) => ({
        ...bid,
        id: `${bid.bidVehicle?.id ?? "bid"}-${index}`,
      })),
    [data?.bidsArchive]
  );

  const columns = useMemo(
    (): TableColumn<ArchiveBidRow>[] => [
      {
        id: "name",
        header: "Name",
        cell: (row) =>
          `${row.user?.firstName ?? ""} ${row.user?.lastName ?? ""}`.trim() || "—",
      },
      { id: "amount", header: "Amount", accessor: "amount" },
      {
        id: "createdAt",
        header: "Created At",
        cell: (row) => (row.user?.createdAt ? formatDate(row.user.createdAt) : "—"),
      },
      {
        id: "updatedAt",
        header: "Updated At",
        cell: (row) => (row.user?.updatedAt ? formatDate(row.user.updatedAt) : "—"),
      },
      {
        id: "vehicle",
        header: "Vehicle Details",
        cell: (row) =>
          row.bidVehicle?.id ? (
            <Link
              href={ROUTES.vehicleEdit(row.bidVehicle.id)}
              className="text-primary hover:underline"
            >
              {row.bidVehicle.registrationNumber ?? "View"}
            </Link>
          ) : (
            "—"
          ),
      },
      {
        id: "createdBy",
        header: "Created By",
        cell: (row) =>
          row.createdById ? (
            <Link href={ROUTES.userDetail(row.createdById)} className="text-primary hover:underline">
              View User
            </Link>
          ) : (
            "—"
          ),
      },
    ],
    []
  );

  return (
    <PageContainer
      title="Bid Archive"
      actions={
        <Link
          href={ROUTES.bidsPerUser(userId)}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          Back to Active Bids
        </Link>
      }
    >
      {loading ? (
        <LoadingState label="Loading archived bids…" />
      ) : (
        <DataTable
          columns={columns}
          data={bids}
          variant="users"
          emptyTitle="No archived bids"
          emptyDescription="Archived bids for this user will appear here."
        />
      )}
    </PageContainer>
  );
}
