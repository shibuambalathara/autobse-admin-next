"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { CallLogsPageToolbar } from "@/modules/crm/components/CallLogsPageToolbar";
import { useCrmCallLogActions } from "@/modules/crm/hooks/useCrmCallLogActions";
import { useDeletedCrmCallLogsList } from "@/modules/crm/hooks/useDeletedCrmCallLogsList";
import { createDeletedCallLogsTableColumns } from "@/modules/crm/tables/deleted-call-logs-table-columns";

interface DeletedCallLogsListViewProps {
  clientId: string;
}

export function DeletedCallLogsListView({ clientId }: DeletedCallLogsListViewProps) {
  const list = useDeletedCrmCallLogsList(clientId);
  const actions = useCrmCallLogActions(() => list.refetch());

  const columns = useMemo(
    () =>
      createDeletedCallLogsTableColumns({
        onRestore: actions.restoreDeletedCallLog,
      }),
    [actions.restoreDeletedCallLog]
  );

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title={`Deleted Call Logs — ${list.clientLabel}`}
        description="Restore soft-deleted call logs for this potential buyer."
        actions={
          <Link
            href={ROUTES.crmCallLogs(clientId)}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Call Logs
          </Link>
        }
      >
        <CallLogsPageToolbar
          filters={list.filters}
          setFilter={list.setFilter}
          staffOptions={list.filterOptions.staffOptions}
          onClear={list.clearFilters}
          addHref={ROUTES.crmCallLogAdd(clientId)}
          deletedHref={ROUTES.crmCallLogsDeleted(clientId)}
          showNextFollowUp={false}
        />

        {list.loading && list.callLogs.length === 0 ? (
          <LoadingState label="Loading deleted call logs…" />
        ) : (
          <DataTable
            columns={columns}
            data={list.callLogs}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search deleted call logs…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No deleted call logs"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>
    </div>
  );
}
