"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { useDeletedScheduleCallsList } from "@/modules/schedule-calls/hooks/useDeletedScheduleCallsList";
import { createDeletedScheduleCallsTableColumns } from "@/modules/schedule-calls/tables/deleted-schedule-calls-table-columns";

export function DeletedScheduleCallsView() {
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const list = useDeletedScheduleCallsList();

  const columns = useMemo(
    () => createDeletedScheduleCallsTableColumns({ onRestore: list.restore }),
    [list.restore]
  );

  const showInitialLoading =
    !list.canFetch || (list.loading && list.scheduleCalls.length === 0);

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Schedule call access restricted"
        description="Only administrators can view deleted scheduled calls."
      />
    );
  }

  return (
    <PageContainer
      title="Deleted Scheduled Calls"
      description="Restore soft-deleted call schedule requests."
      actions={
        <Link
          href={ROUTES.scheduleCalls}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Scheduled Calls
        </Link>
      }
    >
      {showInitialLoading ? (
        <LoadingState label="Loading deleted scheduled calls…" />
      ) : list.error ? (
        <EmptyState
          title="Failed to load deleted scheduled calls"
          description={extractGraphqlError(list.error).message}
        />
      ) : (
        <DataTable
          columns={columns}
          data={list.scheduleCalls}
          variant="users"
          searchValue={list.searchInput}
          onSearchChange={list.setSearchInput}
          searchPlaceholder="Search by name…"
          pagination={{
            page: list.page,
            pageSize: list.pageSize,
            total: list.total,
          }}
          onPageChange={list.setPage}
          emptyTitle="No deleted scheduled calls"
          emptyDescription="Deleted call requests will appear here."
        />
      )}
    </PageContainer>
  );
}
