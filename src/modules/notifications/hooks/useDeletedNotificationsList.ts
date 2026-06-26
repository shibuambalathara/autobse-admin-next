"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import {
  DELETED_NOTIFICATIONS_QUERY,
  RESTORE_NOTIFICATION_MUTATION,
} from "@/graphql/documents/notifications";
import { NOTIFICATIONS_PAGE_SIZE } from "@/modules/notifications/constants";
import { useAuthenticatedAdminQuery } from "@/modules/notifications/hooks/useAuthenticatedAdminQuery";
import type {
  DeletedNotificationItem,
  DeletedNotificationsQueryVariables,
  DeletedNotificationsResult,
} from "@/modules/notifications/types";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

interface UseDeletedNotificationsListOptions {
  userId?: string;
}

export function useDeletedNotificationsList({
  userId,
}: UseDeletedNotificationsListOptions = {}) {
  const { canFetch } = useAuthenticatedAdminQuery();
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);

  const queryVariables = useMemo((): DeletedNotificationsQueryVariables => {
    const where: DeletedNotificationsQueryVariables["where"] = {};
    if (userId) where.userId = userId;

    return {
      where: Object.keys(where).length > 0 ? where : undefined,
      search: searchQuery || undefined,
      skip: (page - 1) * NOTIFICATIONS_PAGE_SIZE,
      take: NOTIFICATIONS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" }],
    };
  }, [page, searchQuery, userId]);

  const { data, loading, error, refetch } = useQuery<DeletedNotificationsResult>(
    DELETED_NOTIFICATIONS_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch,
      fetchPolicy: "network-only",
    }
  );

  const [restoreNotification] = useMutation(RESTORE_NOTIFICATION_MUTATION);

  const notifications = useMemo(
    () => data?.deletedNotifications?.notifications ?? [],
    [data?.deletedNotifications?.notifications]
  );
  const total = data?.deletedNotifications?.deletedNotificationCount ?? 0;

  const restore = useCallback(
    async (notification: DeletedNotificationItem) => {
      const response = await Swal.fire({
        title: "Restore this notification?",
        html: `<b>Title:</b> ${notification.title}<br><b>Type:</b> ${notification.type}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Restore",
        cancelButtonText: "Cancel",
      });

      if (!response.isConfirmed) return;

      try {
        await restoreNotification({ variables: { where: { id: notification.id } } });
        await refetch();
        await Swal.fire({
          icon: "success",
          title: "Restored",
          text: "Notification restored successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err: unknown) {
        const { message } = extractGraphqlError(err);
        await Swal.fire({ icon: "error", title: "Failed", text: message });
      }
    },
    [refetch, restoreNotification]
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, userId]);

  const clearFilters = () => {
    setSearchInput("");
    setPage(1);
  };

  return {
    notifications,
    total,
    loading: !canFetch || loading,
    error,
    refetch,
    restore,
    searchInput,
    setSearchInput,
    page,
    setPage,
    pageSize: NOTIFICATIONS_PAGE_SIZE,
    canFetch,
    clearFilters,
  };
}
