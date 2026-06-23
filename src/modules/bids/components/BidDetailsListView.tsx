"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Trash2, User } from "lucide-react";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { BID_DETAILS_QUERY } from "@/graphql/documents/bids";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { BidActionModal } from "@/modules/bids/components/BidActionModal";
import type { BidListItem } from "@/modules/bids/types";
import type { TableColumn } from "@/types";

interface BidDetailsListViewProps {
  vehicleId: string;
}

export function BidDetailsListView({ vehicleId }: BidDetailsListViewProps) {
  const [deleteBidId, setDeleteBidId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery<{ Bids: BidListItem[] }>(
    BID_DETAILS_QUERY,
    { variables: { where: { bidVehicleId: vehicleId } } }
  );

  const bids = data?.Bids ?? [];
  const header = bids[0]?.bidVehicle;

  const columns = useMemo(
    (): TableColumn<BidListItem>[] => [
      { id: "firstName", header: "First Name", cell: (row) => row.user?.firstName ?? "—" },
      { id: "lastName", header: "Last Name", cell: (row) => row.user?.lastName ?? "—" },
      { id: "openToken", header: "Open Token", cell: (row) => row.user?.openToken ?? "—" },
      { id: "mobile", header: "Mobile", cell: (row) => row.user?.mobile ?? "—" },
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
      { id: "amount", header: "Amount", accessor: "amount" },
      {
        id: "bidder",
        header: "Bidder",
        cell: (row) =>
          row.userId ? (
            <Link
              href={ROUTES.userDetail(row.userId)}
              className="inline-flex h-8 items-center rounded-md bg-sky-600 px-2 text-white hover:bg-sky-700"
            >
              <User className="h-4 w-4" />
            </Link>
          ) : (
            "—"
          ),
      },
      {
        id: "delete",
        header: "Delete Bid",
        cell: (row) => (
          <button
            type="button"
            onClick={() => setDeleteBidId(row.id)}
            className="inline-flex h-8 items-center rounded-md bg-red-600 px-2 text-white hover:bg-red-700"
            title="Delete bid"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ),
      },
    ],
    []
  );

  if (error) {
    return (
      <p className="text-destructive">{extractGraphqlError(error).message}</p>
    );
  }

  return (
    <>
      <PageContainer
        title="Bid History"
        description={
          header
            ? `Lot ${header.lotNumber ?? "—"} · Auction ${header.event?.eventNo ?? "—"} · ${header.registrationNumber ?? ""}`
            : undefined
        }
        actions={
          vehicleId ? (
            <Link
              href={ROUTES.vehicleEdit(vehicleId)}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Vehicle Details
            </Link>
          ) : undefined
        }
      >
        {header && (
          <div className="mb-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            <p>
              Reg. No: <span className="font-medium text-foreground">{header.registrationNumber}</span>
            </p>
            <p>
              Bid Status: <span className="font-medium text-foreground">{header.bidStatus}</span>
            </p>
            <p>
              Seller: <span className="font-medium text-foreground">{header.event?.seller?.name}</span>
            </p>
          </div>
        )}

        {loading ? (
          <LoadingState label="Loading bids…" />
        ) : (
          <DataTable
            columns={columns}
            data={bids}
            variant="users"
            emptyTitle="No bids found"
            emptyDescription="Bid history for this vehicle will appear here."
          />
        )}
      </PageContainer>

      <BidActionModal
        open={Boolean(deleteBidId)}
        bidId={deleteBidId}
        actionType="delete"
        onClose={() => setDeleteBidId(null)}
        onSuccess={() => refetch()}
      />
    </>
  );
}
