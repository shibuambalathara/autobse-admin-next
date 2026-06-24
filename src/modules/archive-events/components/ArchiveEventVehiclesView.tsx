"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { ArrowLeft } from "lucide-react";
import { Button, PageContainer } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ARCHIVE_VEHICLES_QUERY } from "@/graphql/documents/archive-events";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { createArchiveVehiclesTableColumns } from "@/modules/archive-events/tables/archive-events-table-columns";
import {
  ARCHIVE_VEHICLES_PAGE_SIZE,
  type ArchiveVehiclesResult,
} from "@/modules/archive-events/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

interface ArchiveEventVehiclesViewProps {
  eventArchiveId: string;
  eventNo?: string;
  sellerName?: string;
}

export function ArchiveEventVehiclesView({
  eventArchiveId,
  eventNo,
  sellerName,
}: ArchiveEventVehiclesViewProps) {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useQuery<ArchiveVehiclesResult>(
    ARCHIVE_VEHICLES_QUERY,
    {
      variables: {
        where: { event: { id: eventArchiveId } },
        orderBy: [{ createdAt: "DESC" }],
        take: searchQuery ? undefined : ARCHIVE_VEHICLES_PAGE_SIZE,
        skip: searchQuery ? undefined : (page - 1) * ARCHIVE_VEHICLES_PAGE_SIZE,
        search: searchQuery || undefined,
      },
      fetchPolicy: "network-only",
    }
  );

  const vehicles = data?.vehiclesArchive?.vehicles ?? [];
  const total = data?.vehiclesArchive?.vehiclesCount ?? 0;
  const columns = useMemo(() => createArchiveVehiclesTableColumns(), []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const title = eventNo
    ? `Archived Vehicles — Event No: ${eventNo}`
    : "Archived Vehicles";

  return (
    <PageContainer
      title={title}
      description={sellerName ? `Seller: ${sellerName}` : undefined}
      actions={
        <div className="flex flex-wrap gap-2">
          <Link href={ROUTES.archiveEvents}>
            <Button type="button" size="sm" variant="outline">
              <ArrowLeft className="h-4 w-4 shrink-0" />
              Archived Events
            </Button>
          </Link>
          <Link
            href={ROUTES.archiveEventTerms(eventArchiveId, {
              eventNo: eventNo ? Number(eventNo) : undefined,
              sellerName: sellerName ?? undefined,
            })}
          >
            <Button type="button" size="sm" variant="secondary">
              T&C Accepted Users
            </Button>
          </Link>
        </div>
      }
    >
      {loading && vehicles.length === 0 ? (
        <LoadingState label="Loading archived vehicles…" />
      ) : error ? (
        <EmptyState
          title="Failed to load archived vehicles"
          description={extractGraphqlError(error).message}
          action={
            <button
              type="button"
              className="text-sm font-medium text-brand-600 hover:text-brand-900"
              onClick={() => refetch()}
            >
              Retry
            </button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={vehicles}
          isLoading={loading}
          variant="users"
          tableMinWidth={1800}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          searchPlaceholder="Search archived vehicles…"
          pagination={
            searchQuery
              ? undefined
              : {
                  page,
                  pageSize: ARCHIVE_VEHICLES_PAGE_SIZE,
                  total,
                }
          }
          onPageChange={setPage}
          emptyTitle="No archived vehicles found"
          emptyDescription="Try adjusting your search."
        />
      )}
    </PageContainer>
  );
}
