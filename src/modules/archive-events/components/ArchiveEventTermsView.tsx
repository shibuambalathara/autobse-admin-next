"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { ArrowLeft } from "lucide-react";
import { Button, PageContainer } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ARCHIVE_TERMS_QUERY } from "@/graphql/documents/archive-events";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { createArchiveTermsTableColumns } from "@/modules/archive-events/tables/archive-events-table-columns";
import type { ArchiveTermsResult } from "@/modules/archive-events/types";

interface ArchiveEventTermsViewProps {
  eventArchiveId: string;
  eventNo?: string;
  sellerName?: string;
}

export function ArchiveEventTermsView({
  eventArchiveId,
  eventNo,
  sellerName,
}: ArchiveEventTermsViewProps) {

  const { data, loading, error, refetch } = useQuery<ArchiveTermsResult>(
    ARCHIVE_TERMS_QUERY,
    {
      variables: {
        where: { eventArchiveId },
      },
      fetchPolicy: "network-only",
    }
  );

  const terms = data?.termsAndConditionsArchive?.termsAndConditionsArchive ?? [];
  const columns = useMemo(() => createArchiveTermsTableColumns(), []);

  const title = eventNo
    ? `Archived T&C Accepted Users — Event No: ${eventNo}`
    : "Archived T&C Accepted Users";

  return (
    <PageContainer
      title={title}
      description={sellerName ? `Seller: ${sellerName}` : undefined}
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href={ROUTES.archiveEventVehicles(eventArchiveId, {
              eventNo: eventNo ? Number(eventNo) : undefined,
              sellerName: sellerName ?? undefined,
            })}
          >
            <Button type="button" size="sm" variant="outline">
              <ArrowLeft className="h-4 w-4 shrink-0" />
              Archived Vehicles
            </Button>
          </Link>
          <Link href={ROUTES.archiveEvents}>
            <Button type="button" size="sm" variant="secondary">
              Archived Events
            </Button>
          </Link>
        </div>
      }
    >
      {loading && terms.length === 0 ? (
        <LoadingState label="Loading archived terms…" />
      ) : error ? (
        <EmptyState
          title="Failed to load archived terms"
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
          data={terms}
          isLoading={loading}
          variant="users"
          tableMinWidth={900}
          emptyTitle="No archived accepted terms found"
          emptyDescription="No users accepted terms for this archived event."
        />
      )}
    </PageContainer>
  );
}
