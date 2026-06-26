"use client";

import Link from "next/link";
import { useMemo } from "react";
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
import { useDeletedNotificationsList } from "@/modules/notifications/hooks/useDeletedNotificationsList";
import { createDeletedNotificationsTableColumns } from "@/modules/notifications/tables/deleted-notifications-table-columns";
import type { ViewUserQueryResult } from "@/modules/users/types";

interface DeletedNotificationsViewProps {
  userId?: string;
}

export function DeletedNotificationsView({
  userId,
}: DeletedNotificationsViewProps) {
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const list = useDeletedNotificationsList({ userId });

  const { data: userData } = useQuery<ViewUserQueryResult>(VIEW_USER_QUERY, {
    variables: { where: { id: userId } },
    skip: !userId || !list.canFetch,
    fetchPolicy: "cache-first",
  });

  const columns = useMemo(
    () =>
      createDeletedNotificationsTableColumns({
        onRestore: list.restore,
        showCreatedBy: !userId,
      }),
    [list.restore, userId]
  );

  const showInitialLoading =
    !list.canFetch || (list.loading && list.notifications.length === 0);

  const userName = userData?.user
    ? `${userData.user.firstName ?? ""} ${userData.user.lastName ?? ""}`.trim()
    : "";

  const pageTitle = userId
    ? `Deleted Notifications${userName ? ` of ${userName}` : ""}`
    : "Deleted Notifications";

  const backHref = userId
    ? ROUTES.userNotifications(userId)
    : ROUTES.notifications;

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Notification access restricted"
        description="Only administrators can view deleted notifications."
      />
    );
  }

  return (
    <PageContainer
      title={pageTitle}
      description="Restore soft-deleted notifications."
      actions={
        <Link
          href={backHref}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          {userId ? "Back to User Notifications" : "Back to Notifications"}
        </Link>
      }
    >
      <div className="mb-4 lg:hidden">
        <Link
          href={backHref}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          {userId ? "Back to User Notifications" : "Back to Notifications"}
        </Link>
      </div>

      {showInitialLoading ? (
        <LoadingState label="Loading deleted notifications…" />
      ) : list.error ? (
        <EmptyState
          title="Failed to load deleted notifications"
          description={extractGraphqlError(list.error).message}
        />
      ) : (
        <DataTable
          columns={columns}
          data={list.notifications}
          variant="users"
          searchValue={list.searchInput}
          onSearchChange={list.setSearchInput}
          searchPlaceholder="Search by title, type, message…"
          pagination={{
            page: list.page,
            pageSize: list.pageSize,
            total: list.total,
          }}
          onPageChange={list.setPage}
          emptyTitle="No deleted notifications"
          emptyDescription="Deleted notifications will appear here."
        />
      )}
    </PageContainer>
  );
}
