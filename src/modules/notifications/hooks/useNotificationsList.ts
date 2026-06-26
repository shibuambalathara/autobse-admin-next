"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { NOTIFICATIONS_LIST_QUERY } from "@/graphql/documents/notifications";
import { NOTIFICATIONS_PAGE_SIZE } from "@/modules/notifications/constants";
import { useAuthenticatedAdminQuery } from "@/modules/notifications/hooks/useAuthenticatedAdminQuery";
import type {
  NotificationType,
  NotificationsListResult,
  NotificationsQueryVariables,
} from "@/modules/notifications/types";

export function useNotificationsList() {
  const { canFetch } = useAuthenticatedAdminQuery();
  const [type, setType] = useState<NotificationType | "">("");
  const [isRead, setIsRead] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);

  const queryVariables = useMemo((): NotificationsQueryVariables => {
    const where: NotificationsQueryVariables["where"] = {};
    if (type) where.type = type;
    if (isRead === "true") where.isRead = true;
    if (isRead === "false") where.isRead = false;

    return {
      where: Object.keys(where).length > 0 ? where : undefined,
      skip: (page - 1) * NOTIFICATIONS_PAGE_SIZE,
      take: NOTIFICATIONS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" }],
    };
  }, [isRead, page, type]);

  const { data, loading, error, refetch } = useQuery<NotificationsListResult>(
    NOTIFICATIONS_LIST_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch,
      fetchPolicy: "network-only",
    }
  );

  const notifications = useMemo(
    () => data?.notifications?.notifications ?? [],
    [data?.notifications?.notifications]
  );
  const total = data?.notifications?.notificationCount ?? 0;

  useEffect(() => {
    setPage(1);
  }, [type, isRead]);

  const clearFilters = () => {
    setType("");
    setIsRead("");
    setPage(1);
  };

  return {
    notifications,
    total,
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
