"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import {
  DELETE_CRM_CALL_LOG_MUTATION,
  RESTORE_CRM_CALL_LOG_MUTATION,
} from "@/graphql/documents/crm";
import type { CrmCallLog } from "@/modules/crm/types";
import { getCallStatusLabel } from "@/modules/crm/utils";
import { extractGraphqlError } from "@/lib/graphql-errors";

export function useCrmCallLogActions(onSuccess?: () => void) {
  const [deleteCallLog] = useMutation(DELETE_CRM_CALL_LOG_MUTATION);
  const [restoreCallLog] = useMutation(RESTORE_CRM_CALL_LOG_MUTATION);

  const deleteCrmCallLog = useCallback(
    async (callLog: CrmCallLog) => {
      const response = await Swal.fire({
        title: "Are you sure you want to delete this call log?",
        html: `
          Staff: ${callLog.staff?.firstName ?? "—"}<br>
          Call Status: ${getCallStatusLabel(callLog.callStatus)}
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Delete Call Log",
        cancelButtonText: "Cancel",
      });

      if (!response.isConfirmed) return;

      try {
        await deleteCallLog({ variables: { where: { id: callLog.id } } });
        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Call log deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        onSuccess?.();
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Error", text: message });
      }
    },
    [deleteCallLog, onSuccess]
  );

  const restoreDeletedCallLog = useCallback(
    async (callLog: CrmCallLog) => {
      const response = await Swal.fire({
        title: "Are you sure you want to restore this call log?",
        html: `
          Staff: ${callLog.staff?.firstName ?? "—"}<br>
          Call Status: ${getCallStatusLabel(callLog.callStatus)}
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Restore Call Log",
        cancelButtonText: "Cancel",
      });

      if (!response.isConfirmed) return;

      try {
        await restoreCallLog({ variables: { where: { id: callLog.id } } });
        await Swal.fire({
          icon: "success",
          title: "Restored",
          text: "Call log restored successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        onSuccess?.();
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Error", text: message });
      }
    },
    [onSuccess, restoreCallLog]
  );

  return { deleteCrmCallLog, restoreDeletedCallLog };
}
