"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { ArrowLeft, Bell } from "lucide-react";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { VIEW_USER_QUERY } from "@/graphql/documents/users";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { NotificationFilterFields } from "@/modules/notifications/components/NotificationFilterFields";
import { useNotificationRowActions } from "@/modules/notifications/hooks/useNotificationRowActions";
import { useNotificationsByUserList } from "@/modules/notifications/hooks/useNotificationsByUserList";
import { useNotificationsList } from "@/modules/notifications/hooks/useNotificationsList";
import { createNotificationsTableColumns } from "@/modules/notifications/tables/notifications-table-columns";
import type { ViewUserQueryResult } from "@/modules/users/types";

interface NotificationsListViewProps {
  userId?: string;
}

export function NotificationsListView({ userId }: NotificationsListViewProps) {
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const globalList = useNotificationsList();
  const userList = useNotificationsByUserList({ userId: userId ?? "" });
  const list = userId ? userList : globalList;

  const { data: userData } = useQuery<ViewUserQueryResult>(VIEW_USER_QUERY, {
    variables: { where: { id: userId } },
    skip: !userId || !list.canFetch,
    fetchPolicy: "cache-first",
  });

  const actions = useNotificationRowActions(() => list.refetch());

  const columns = useMemo(
    () =>
      createNotificationsTableColumns({
        onDelete: actions.handleDelete,
        showViewUser: !userId,
      }),
    [actions.handleDelete, userId]
  );

  const showInitialLoading =
    !list.canFetch || (list.loading && list.notifications.length === 0);

  const userName = userData?.user
    ? `${userData.user.firstName ?? ""} ${userData.user.lastName ?? ""}`.trim()
    : "";

  const pageTitle = userId
    ? `Notifications${userName ? ` of ${userName}` : ""}`
    : "Notifications";

  const pageDescription = userId
    ? "Review notifications sent to this user."
    : "View and manage system notifications.";

  const deletedHref = userId
    ? ROUTES.userNotificationsDeleted(userId)
    : ROUTES.notificationsDeleted;

  const backHref = userId ? ROUTES.userDetail(userId) : undefined;

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Notification access restricted"
        description="Only administrators can view notifications."
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title={pageTitle}
        description={pageDescription}
        actions={
          <div className="hidden flex-wrap gap-2 lg:flex">
            {backHref ? (
              <Link
                href={backHref}
                className={buttonVariants({ size: "sm", variant: "outline" })}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to User
              </Link>
            ) : null}
            <Link
              href={deletedHref}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              <Bell className="h-4 w-4" />
              Deleted Notifications
            </Link>
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
          {backHref ? (
            <Link
              href={backHref}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to User
            </Link>
          ) : null}
          <Link
            href={deletedHref}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            <Bell className="h-4 w-4" />
            Deleted Notifications
          </Link>
        </div>

        {userId && userList.unreadCount > 0 ? (
          <p className="mb-4 text-sm text-neutral-600">
            {userList.unreadCount} unread notification
            {userList.unreadCount === 1 ? "" : "s"}
          </p>
        ) : null}

        <NotificationFilterFields
          type={list.type}
          isRead={list.isRead}
          onTypeChange={list.setType}
          onIsReadChange={list.setIsRead}
          onClear={list.clearFilters}
        />

        {showInitialLoading ? (
          <LoadingState label="Loading notifications…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load notifications"
            description={extractGraphqlError(list.error).message}
          />
        ) : (
          <DataTable
            columns={columns}
            data={list.notifications}
            variant="users"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No notifications found"
            emptyDescription="Try adjusting your filters."
          />
        )}
      </PageContainer>
    </div>
  );
}
