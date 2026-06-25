"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import {
  DELETE_SCHEDULE_CALL_MUTATION,
  UPDATE_SCHEDULE_CALL_MUTATION,
} from "@/graphql/documents/schedule-calls";
import { SCHEDULE_CALL_STATUS_OPTIONS } from "@/modules/schedule-calls/constants";
import type {
  CallScheduleStatus,
  ScheduleCall,
} from "@/modules/schedule-calls/types";

export function useScheduleCallRowActions(onChanged: () => void) {
  const [updateScheduleCall] = useMutation(UPDATE_SCHEDULE_CALL_MUTATION);
  const [deleteScheduleCall] = useMutation(DELETE_SCHEDULE_CALL_MUTATION);

  const handleStatusChange = useCallback(
    async (scheduleCall: ScheduleCall) => {
      const currentStatus = scheduleCall.status ?? "PENDING";
      const inputOptions = SCHEDULE_CALL_STATUS_OPTIONS.reduce<
        Record<string, string>
      >((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {});

      const result = await Swal.fire({
        title: "Update status",
        input: "select",
        inputOptions,
        inputValue: currentStatus,
        showCancelButton: true,
        confirmButtonText: "Update",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed || !result.value) return;

      const newStatus = result.value as CallScheduleStatus;
      if (newStatus === currentStatus) return;

      try {
        await updateScheduleCall({
          variables: {
            where: { id: scheduleCall.id },
            data: { status: newStatus },
          },
        });
        onChanged();
        await Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Status updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to update status.";
        await Swal.fire({ icon: "error", title: "Failed", text: message });
      }
    },
    [onChanged, updateScheduleCall]
  );

  const handleDelete = useCallback(
    async (scheduleCall: ScheduleCall) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete scheduled call #${scheduleCall.ScheduleNo ?? "—"}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      try {
        await deleteScheduleCall({ variables: { where: { id: scheduleCall.id } } });
        onChanged();
        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Schedule call has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to delete schedule call.";
        await Swal.fire({ icon: "error", title: "Failed", text: message });
      }
    },
    [deleteScheduleCall, onChanged]
  );

  return { handleStatusChange, handleDelete };
}
