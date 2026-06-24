"use client";

import { useCallback, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { ACR_ARCHIVE_QUERY } from "@/graphql/documents/archive-events";
import type { AcrArchiveResult } from "@/modules/archive-events/types";
import {
  buildAcrFileName,
  exportAcrReport,
} from "@/modules/events/utils/event-acr";

export function useArchiveAcrDownload() {
  const [fetchArchiveAcr] = useLazyQuery<AcrArchiveResult>(ACR_ARCHIVE_QUERY, {
    fetchPolicy: "network-only",
  });
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  const downloadArchiveAcr = useCallback(
    async (params: {
      eventId: string;
      eventNo?: number | null;
      sellerName?: string;
      locationName?: string;
    }) => {
      setLoadingEventId(params.eventId);
      try {
        const { data } = await fetchArchiveAcr({
          variables: { eventId: params.eventId },
        });
        const report = data?.getAcrArchive;
        const fileName = buildAcrFileName({
          eventNo: params.eventNo,
          seller: { name: params.sellerName },
          location: { name: params.locationName },
        });
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
        setLoadingEventId(null);
      }
    },
    [fetchArchiveAcr]
  );

  return { downloadArchiveAcr, loadingEventId };
}
