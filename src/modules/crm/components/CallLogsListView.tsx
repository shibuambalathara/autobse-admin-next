"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { useAuth } from "@/auth/use-auth";
import { APP_ROLES, isRole } from "@/auth/roles";
import { ROUTES } from "@/constants/routes";
import { CallLogsPageToolbar } from "@/modules/crm/components/CallLogsPageToolbar";
import { useCrmCallLogActions } from "@/modules/crm/hooks/useCrmCallLogActions";
import { useCrmCallLogsList } from "@/modules/crm/hooks/useCrmCallLogsList";
import { createCallLogsTableColumns } from "@/modules/crm/tables/call-logs-table-columns";

interface CallLogsListViewProps {
  clientId: string;
}

export function CallLogsListView({ clientId }: CallLogsListViewProps) {
  const { user } = useAuth();
  const canEdit =
    isRole(user?.role ?? null, APP_ROLES.ADMIN) ||
    isRole(user?.role ?? null, APP_ROLES.STAFF);

  const list = useCrmCallLogsList(clientId);
  const actions = useCrmCallLogActions(() => list.refetch());

  const columns = useMemo(
    () =>
      createCallLogsTableColumns({
        onDelete: actions.deleteCrmCallLog,
        canEdit,
        showStaffColumn: !list.isStaff,
      }),
    [actions.deleteCrmCallLog, canEdit, list.isStaff]
  );

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title={`Call Logs — ${list.clientLabel}`}
        description="Track call history and follow-ups for this buyer lead."
        actions={
          <div className="hidden flex-wrap gap-2 lg:flex">
            <Link
              href={ROUTES.crm}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to CRM
            </Link>
            <Link
              href={ROUTES.crmCallLogsDeleted(clientId)}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Deleted Call Logs
            </Link>
            <Link
              href={ROUTES.crmCallLogAdd(clientId)}
              className={buttonVariants({ size: "sm" })}
            >
              <Plus className="h-4 w-4" />
              Add Call Log
            </Link>
          </div>
        }
      >
        <CallLogsPageToolbar
          filters={list.filters}
          setFilter={list.setFilter}
          staffOptions={list.filterOptions.staffOptions}
          showStaffFilter={!list.isStaff}
          onClear={list.clearFilters}
          addHref={ROUTES.crmCallLogAdd(clientId)}
          deletedHref={ROUTES.crmCallLogsDeleted(clientId)}
        />

        {list.loading && list.callLogs.length === 0 ? (
          <LoadingState label="Loading call logs…" />
        ) : (
          <DataTable
            columns={columns}
            data={list.callLogs}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search call logs…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No call logs"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>
    </div>
  );
}
