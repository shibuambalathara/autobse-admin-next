"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { UPDATE_NOTIFICATION_MUTATION } from "@/graphql/documents/notifications";
import type { NotificationItem } from "@/modules/notifications/types";
import { extractGraphqlError } from "@/lib/graphql-errors";

export function useNotificationRowActions(onChanged: () => void) {
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION_MUTATION);

  const handleDelete = useCallback(
    async (notification: NotificationItem) => {
      const response = await Swal.fire({
        title: "Delete this notification?",
        html: `<b>Title:</b> ${notification.title}<br><b>Type:</b> ${notification.type}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      });

      if (!response.isConfirmed) return;

      try {
        await updateNotification({
          variables: {
            where: { id: notification.id, userId: notification.userId },
            updateNotificationInput: { isDeleted: true },
          },
        });
        onChanged();
        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Notification deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err: unknown) {
        const { message } = extractGraphqlError(err);
        await Swal.fire({ icon: "error", title: "Failed", text: message });
      }
    },
    [onChanged, updateNotification]
  );

  return { handleDelete };
}
