"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { NOTIFICATIONS_BY_USER_QUERY } from "@/graphql/documents/notifications";
import { NOTIFICATIONS_PAGE_SIZE } from "@/modules/notifications/constants";
import { useAuthenticatedAdminQuery } from "@/modules/notifications/hooks/useAuthenticatedAdminQuery";
import type {
  NotificationType,
  NotificationsByUserQueryVariables,
  NotificationsByUserResult,
} from "@/modules/notifications/types";

interface UseNotificationsByUserListOptions {
  userId: string;
}

export function useNotificationsByUserList({
  userId,
}: UseNotificationsByUserListOptions) {
  const { canFetch } = useAuthenticatedAdminQuery();
  const [type, setType] = useState<NotificationType | "">("");
  const [isRead, setIsRead] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);

  const queryVariables = useMemo((): NotificationsByUserQueryVariables => {
    const where: NotificationsByUserQueryVariables["where"] = { userId };
    if (type) where.type = type;
    if (isRead === "true") where.isRead = true;
    if (isRead === "false") where.isRead = false;

    return {
      where,
      skip: (page - 1) * NOTIFICATIONS_PAGE_SIZE,
      take: NOTIFICATIONS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" }],
    };
  }, [isRead, page, type, userId]);

  const { data, loading, error, refetch } = useQuery<NotificationsByUserResult>(
    NOTIFICATIONS_BY_USER_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch || !userId,
      fetchPolicy: "network-only",
    }
  );

  const notifications = useMemo(
    () => data?.notificationByUser?.notifications ?? [],
    [data?.notificationByUser?.notifications]
  );
  const total = data?.notificationByUser?.notificationCount ?? 0;
  const unreadCount = data?.notificationByUser?.unreadCount ?? 0;

  useEffect(() => {
    setPage(1);
  }, [type, isRead, userId]);

  const clearFilters = () => {
    setType("");
    setIsRead("");
    setPage(1);
  };

  return {
    notifications,
    total,
    unreadCount,
    loading: !canFetch || loading,
    error,
    refetch,
    type,
    setType,
    isRead,
    setIsRead,
    page,
    setPage,
    pageSize: NOTIFICATIONS_PAGE_SIZE,
    canFetch,
    clearFilters,
  };
}
