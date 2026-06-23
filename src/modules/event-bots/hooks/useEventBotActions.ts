"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import {
  DELETE_AUTO_EVENT_MUTATION,
  HARD_DELETE_AUTO_EVENT_MUTATION,
  RESTORE_AUTO_EVENT_MUTATION,
} from "@/graphql/documents/event-bots";
import { extractGraphqlError } from "@/lib/graphql-errors";
import type {
  DeletedEventBotItem,
  EventBotItem,
} from "@/modules/event-bots/types";

export function useEventBotActions(onSuccess?: () => void) {
  const [deleteAutoEvent] = useMutation(DELETE_AUTO_EVENT_MUTATION);
  const [restoreAutoEvent] = useMutation(RESTORE_AUTO_EVENT_MUTATION);
  const [hardDeleteAutoEvent] = useMutation(HARD_DELETE_AUTO_EVENT_MUTATION);

  const deleteEventBot = useCallback(
    async (id: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this EventBot?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it",
      });

      if (!result.isConfirmed) return;

      try {
        await deleteAutoEvent({ variables: { where: { id } } });
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "EventBot deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        onSuccess?.();
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Error", text: message });
      }
    },
    [deleteAutoEvent, onSuccess]
  );

  const restoreEventBot = useCallback(
    async (event: DeletedEventBotItem) => {
      const result = await Swal.fire({
        title: "Restore EventBot?",
        html: `<b>Status:</b> ${event.status}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Restore",
      });

      if (!result.isConfirmed) return;

      try {
        await restoreAutoEvent({ variables: { where: { id: event.id } } });
        await Swal.fire({
          icon: "success",
          title: "Restored!",
          timer: 1500,
          showConfirmButton: false,
        });
        onSuccess?.();
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({
          icon: "error",
          title: "Restore Failed!",
          text: message,
        });
      }
    },
    [onSuccess, restoreAutoEvent]
  );

  const permanentlyDeleteEventBot = useCallback(
    async (event: DeletedEventBotItem) => {
      const result = await Swal.fire({
        title: "Permanent Delete EventBot?",
        html: `<b>Status:</b> ${event.status}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Permanent Delete",
      });

      if (!result.isConfirmed) return;

      try {
        await hardDeleteAutoEvent({ variables: { where: { id: event.id } } });
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          timer: 1500,
          showConfirmButton: false,
        });
        onSuccess?.();
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({
          icon: "error",
          title: "Delete Failed!",
          text: message,
        });
      }
    },
    [hardDeleteAutoEvent, onSuccess]
  );

  return {
    deleteEventBot,
    restoreEventBot,
    permanentlyDeleteEventBot,
  };
}

export function useEventBotSellerMap(
  sellers: Array<{ id: string; name?: string | null }>
) {
  return useMemo(() => {
    const map = new Map<string, string>();
    sellers.forEach((seller) => {
      map.set(seller.id, seller.name ?? seller.id);
    });
    return map;
  }, [sellers]);
}

export function useEventBotDisplayRows<T extends { sellerId: string }>(
  rows: T[],
  sellerMap: Map<string, string>
) {
  return useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        sellerName: sellerMap.get(row.sellerId) ?? "—",
      })),
    [rows, sellerMap]
  );
}

export type EventBotDisplayRow = EventBotItem & { sellerName: string };

export function useResetPageOnFilterChange(
  deps: unknown[],
  setPage: (page: number) => void
) {
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
