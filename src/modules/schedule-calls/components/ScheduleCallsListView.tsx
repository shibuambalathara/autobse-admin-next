"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { Phone } from "lucide-react";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { ScheduleCallFilterFields } from "@/modules/schedule-calls/components/ScheduleCallFilterFields";
import { ScheduleCallMessageModal } from "@/modules/schedule-calls/components/modals/ScheduleCallMessageModal";
import { useScheduleCallRowActions } from "@/modules/schedule-calls/hooks/useScheduleCallRowActions";
import { useScheduleCallsList } from "@/modules/schedule-calls/hooks/useScheduleCallsList";
import { createScheduleCallsTableColumns } from "@/modules/schedule-calls/tables/schedule-calls-table-columns";

export function ScheduleCallsListView() {
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const list = useScheduleCallsList();
  const actions = useScheduleCallRowActions(() => list.refetch());
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  const openMessage = useCallback((message: string) => {
    setMessageText(message);
    setMessageOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      createScheduleCallsTableColumns({
        onViewMessage: openMessage,
        onStatusChange: actions.handleStatusChange,
        onDelete: actions.handleDelete,
      }),
    [actions.handleDelete, actions.handleStatusChange, openMessage]
  );

  const showInitialLoading =
    !list.canFetch || (list.loading && list.scheduleCalls.length === 0);

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Schedule call access restricted"
        description="Only administrators can view scheduled calls."
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Scheduled Calls"
        description="Review and manage customer call schedule requests."
        actions={
          <Link
            href={ROUTES.scheduleCallsDeleted}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            <Phone className="h-4 w-4" />
            Deleted Scheduled Calls
          </Link>
        }
      >
        <div className="mb-4 lg:hidden">
          <Link
            href={ROUTES.scheduleCallsDeleted}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            <Phone className="h-4 w-4" />
            Deleted Scheduled Calls
          </Link>
        </div>

        <ScheduleCallFilterFields
          status={list.status}
          state={list.state}
          onStatusChange={list.setStatus}
          onStateChange={list.setState}
          onClear={list.clearFilters}
        />

        {showInitialLoading ? (
          <LoadingState label="Loading scheduled calls…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load scheduled calls"
            description={extractGraphqlError(list.error).message}
          />
        ) : (
          <DataTable
            columns={columns}
            data={list.scheduleCalls}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by name, email…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No scheduled calls found"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>

      <ScheduleCallMessageModal
        open={messageOpen}
        message={messageText}
        onClose={() => setMessageOpen(false)}
      />
    </div>
  );
}
