"use client";

import { useCallback, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import {
  ARCHIVE_EVENT_MUTATION,
  EVENT_FOR_ACR_QUERY,
} from "@/graphql/documents/events";
import {
  extractGraphqlError,
  getGraphqlResultErrorMessage,
} from "@/lib/graphql-errors";
import {
  buildAcrFileName,
  exportAcrReport,
} from "@/modules/events/utils/event-acr";
import { sendEventWhatsAppNotification } from "@/modules/events/utils/event-api";
import type { EventListItem } from "@/modules/events/types";

interface EventForAcrResult {
  event: {
    Report?: Array<Record<string, unknown>> | null;
  };
}

export function useEventRowActions(onArchived: () => void) {
  const [archiveEvent] = useMutation(ARCHIVE_EVENT_MUTATION);
  const [fetchAcrData] = useLazyQuery<EventForAcrResult>(EVENT_FOR_ACR_QUERY, {
    fetchPolicy: "network-only",
  });
  const [acrLoadingEventId, setAcrLoadingEventId] = useState<string | null>(null);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

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
        const response = await archiveEvent({
          variables: { eventId: event.id },
        });

        const gqlErrorMessage = getGraphqlResultErrorMessage(response);
        if (gqlErrorMessage) {
          await Swal.fire({ icon: "error", title: "Failed", text: gqlErrorMessage });
          return;
        }

        const archivedEventNo = response.data?.archiveEvent;
        if (archivedEventNo == null) {
          await Swal.fire({
            icon: "error",
            title: "Failed",
            text: "Failed to archive event.",
          });
          return;
        }

        await Swal.fire({
          icon: "success",
          title: "Event Archived",
          text: `Event No: ${archivedEventNo} archived`,
        });
        onArchived();
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Failed", text: message });
      }
    },
    [archiveEvent, onArchived]
  );

  const handleDownloadAcr = useCallback(
    async (event: EventListItem) => {
      setAcrLoadingEventId(event.id);
      try {
        const { data } = await fetchAcrData({
          variables: { where: { id: event.id } },
        });
        const report = data?.event?.Report;
        const fileName = buildAcrFileName(event);
        const exported = exportAcrReport(report, fileName);

        if (!exported) {
          await Swal.fire({
            icon: "warning",
            title: "No data available",
            text: "No data available for download.",
          });
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to generate Excel";
        await Swal.fire({ icon: "error", title: "Failed", text: message });
      } finally {
        setAcrLoadingEventId(null);
      }
    },
    [fetchAcrData]
  );

  const handleWhatsApp = useCallback(async (event: EventListItem) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "question",
      text: `Do you want to send WhatsApp notification to all ${event.location?.name || "locations"} buyers?`,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setWhatsappLoading(true);
    try {
      await sendEventWhatsAppNotification(event.id);
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "WhatsApp notification sent successfully",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "WhatsApp notification failed";
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    } finally {
      setWhatsappLoading(false);
    }
  }, []);

  return {
    handleArchive,
    handleDownloadAcr,
    handleWhatsApp,
    acrLoadingEventId,
    whatsappLoading,
  };
}
