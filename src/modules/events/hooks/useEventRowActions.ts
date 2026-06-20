"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { ARCHIVE_EVENT_MUTATION } from "@/graphql/documents/events";
import type { EventListItem } from "@/modules/events/types";

export function useEventRowActions(onArchived: () => void) {
  const [archiveEvent] = useMutation(ARCHIVE_EVENT_MUTATION);

  const handleArchive = useCallback(
    async (event: EventListItem) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        icon: "question",
        text: "Do you want to archive this event?",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      try {
        await archiveEvent({ variables: { eventId: event.id } });
        await Swal.fire({
          icon: "success",
          title: "Event Archived",
          text: `Event No: ${event.eventNo} archived`,
        });
        onArchived();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to archive event";
        await Swal.fire({ icon: "error", title: "Failed", text: message });
      }
    },
    [archiveEvent, onArchived]
  );

  return { handleArchive };
}
