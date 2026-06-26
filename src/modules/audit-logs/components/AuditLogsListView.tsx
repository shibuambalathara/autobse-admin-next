"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { ArrowLeft } from "lucide-react";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { VIEW_USER_QUERY } from "@/graphql/documents/users";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { AuditLogFilterFields } from "@/modules/audit-logs/components/AuditLogFilterFields";
import { AuditLogChangesModal } from "@/modules/audit-logs/components/modals/AuditLogChangesModal";
import { useAuditLogsList } from "@/modules/audit-logs/hooks/useAuditLogsList";
import { useUserAuditLogsList } from "@/modules/audit-logs/hooks/useUserAuditLogsList";
import { createAuditLogsTableColumns } from "@/modules/audit-logs/tables/audit-logs-table-columns";

interface AuditLogsListViewProps {
  userId?: string;
}

export function AuditLogsListView({ userId }: AuditLogsListViewProps) {
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const globalList = useAuditLogsList();
  const userList = useUserAuditLogsList({ userId: userId ?? "" });
  const list = userId ? userList : globalList;

  const { data: userData } = useQuery(VIEW_USER_QUERY, {
    variables: { userId },
    skip: !userId || !list.canFetch,
    fetchPolicy: "cache-first",
  });

  const [changesOpen, setChangesOpen] = useState(false);
  const [selectedChanges, setSelectedChanges] = useState<unknown>(null);

  const openChanges = useCallback((changes: unknown) => {
    setSelectedChanges(changes);
    setChangesOpen(true);
  }, []);

  const columns = useMemo(
    () => createAuditLogsTableColumns({ onViewChanges: openChanges }),
    [openChanges]
  );

  const showInitialLoading =
    !list.canFetch || (list.loading && list.auditLogs.length === 0);

  const userName = userData?.user
    ? `${userData.user.firstName ?? ""} ${userData.user.lastName ?? ""}`.trim()
    : "";

  const pageTitle = userId
    ? `Audit Logs${userName ? ` of ${userName}` : ""}`
    : "Audit Logs";

  const pageDescription = userId
    ? "Review activity performed by this user."
    : "Track create, update, delete, and restore actions across the system.";

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Audit log access restricted"
        description="Only administrators can view audit logs."
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title={pageTitle}
        description={pageDescription}
        actions={
          userId ? (
            <Link
              href={ROUTES.userDetail(userId)}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to User
            </Link>
          ) : undefined
        }
      >
        {userId ? (
          <div className="mb-4 lg:hidden">
            <Link
              href={ROUTES.userDetail(userId)}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to User
            </Link>
          </div>
        ) : null}

        <AuditLogFilterFields
          entityType={list.entityType}
          changedByRole={list.changedByRole}
          onEntityTypeChange={list.setEntityType}
          onChangedByRoleChange={list.setChangedByRole}
          onClear={list.clearFilters}
        />

        {showInitialLoading ? (
          <LoadingState label="Loading audit logs…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load audit logs"
            description={extractGraphqlError(list.error).message}
          />
        ) : (
          <DataTable
            columns={columns}
            data={list.auditLogs}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by entity type, action, role…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No audit logs found"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>

      <AuditLogChangesModal
        open={changesOpen}
        changes={selectedChanges}
        onClose={() => setChangesOpen(false)}
      />
    </div>
  );
}
