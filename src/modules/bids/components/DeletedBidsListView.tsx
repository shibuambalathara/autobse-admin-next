"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { RotateCcw } from "lucide-react";
import Swal from "sweetalert2";
import { PageContainer, Button, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { DELETED_BIDS_QUERY, RESTORE_BID_MUTATION } from "@/graphql/documents/bids";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { DELETED_BIDS_PAGE_SIZE } from "@/modules/bids/constants";
import type { DeletedBidItem } from "@/modules/bids/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";
import type { TableColumn } from "@/types";

interface DeletedBidsListViewProps {
  eventId: string;
}

export function DeletedBidsListView({ eventId }: DeletedBidsListViewProps) {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);
  const [restoreBid] = useMutation(RESTORE_BID_MUTATION);

  const isSearching = Boolean(searchQuery);

  const { data, loading, refetch } = useQuery<{
    deletedBids: { deletedbidsCount: number; bids: DeletedBidItem[] };
  }>(DELETED_BIDS_QUERY, {
    variables: {
      eventId,
      orderBy: [{ createdAt: "DESC" }],
      search: searchQuery || undefined,
      take: isSearching ? undefined : DELETED_BIDS_PAGE_SIZE,
      skip: isSearching ? undefined : (page - 1) * DELETED_BIDS_PAGE_SIZE,
    },
    fetchPolicy: "network-only",
  });

  const bids = data?.deletedBids?.bids ?? [];
  const total = data?.deletedBids?.deletedbidsCount ?? 0;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleRestore = useCallback(async (bid: DeletedBidItem) => {
    const result = await Swal.fire({
      title: "Restore bid?",
      html: `<strong>${bid.name ?? ""}</strong>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Restore",
    });
    if (!result.isConfirmed) return;

    try {
      await restoreBid({
        variables: {
          where: { id: bid.id },
          restoreBidInput: { reasonForRestore: "Restored by admin" },
        },
      });
      await refetch();
      await Swal.fire({ icon: "success", title: "Restored", timer: 2000, showConfirmButton: false });
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  }, [refetch, restoreBid]);

  const columns = useMemo(
    (): TableColumn<DeletedBidItem>[] => [
      { id: "name", header: "Bid Name", accessor: "name" },
      { id: "amount", header: "Amount", accessor: "amount" },
      {
        id: "createdAt",
        header: "Created At",
        cell: (row) => (row.createdAt ? formatDate(row.createdAt) : "—"),
      },
      {
        id: "restore",
        header: "Restore",
        cell: (row) => (
          <button
            type="button"
            onClick={() => handleRestore(row)}
            className="inline-flex h-8 items-center justify-center rounded-md bg-emerald-600 px-2 text-white hover:bg-emerald-700"
            title="Restore bid"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        ),
      },
    ],
    [handleRestore]
  );

  return (
    <PageContainer
      title="Deleted Bids"
      actions={
        <Link
          href={ROUTES.eventVehicles(eventId)}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          Back to Vehicles
        </Link>
      }
    >
      {loading && bids.length === 0 ? (
        <LoadingState label="Loading deleted bids…" />
      ) : (
        <DataTable
          columns={columns}
          data={bids}
          variant="users"
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="Search by bidder name…"
          toolbarActions={
            searchInput ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setSearchInput("")}
              >
                Clear
              </Button>
            ) : undefined
          }
          pagination={{
            page,
            pageSize: DELETED_BIDS_PAGE_SIZE,
            total,
          }}
          onPageChange={setPage}
          emptyTitle="No deleted bids"
          emptyDescription="Deleted bids for this event will appear here."
        />
      )}
    </PageContainer>
  );
}
