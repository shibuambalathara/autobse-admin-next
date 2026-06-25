"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import {
  DELETED_SCHEDULE_CALLS_QUERY,
  RESTORE_SCHEDULE_CALL_MUTATION,
} from "@/graphql/documents/schedule-calls";
import { SCHEDULE_CALLS_PAGE_SIZE } from "@/modules/schedule-calls/constants";
import { useAuthenticatedAdminQuery } from "@/modules/schedule-calls/hooks/useAuthenticatedAdminQuery";
import type {
  DeletedScheduleCallsResult,
  ScheduleCall,
} from "@/modules/schedule-calls/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useDeletedScheduleCallsList() {
  const { canFetch } = useAuthenticatedAdminQuery();
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);
  const isSearching = Boolean(searchQuery);

  const queryVariables = useMemo(
    () => ({
      search: searchQuery || undefined,
      skip: isSearching ? undefined : (page - 1) * SCHEDULE_CALLS_PAGE_SIZE,
      take: isSearching ? undefined : SCHEDULE_CALLS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" as const }],
    }),
    [isSearching, page, searchQuery]
  );

  const { data, loading, error, refetch } = useQuery<DeletedScheduleCallsResult>(
    DELETED_SCHEDULE_CALLS_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch,
      fetchPolicy: "network-only",
    }
  );

  const [restoreScheduleCall] = useMutation(RESTORE_SCHEDULE_CALL_MUTATION);

  const scheduleCalls = useMemo(
    () => data?.deletedSchedulecalls?.schedulecalls ?? [],
    [data?.deletedSchedulecalls?.schedulecalls]
  );
  const total = data?.deletedSchedulecalls?.deletedSchedulecallCount ?? 0;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const restore = async (scheduleCall: ScheduleCall) => {
    const result = await Swal.fire({
      title: "Restore this scheduled call?",
      html: `<strong>${scheduleCall.fullName ?? "—"}</strong>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Restore",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await restoreScheduleCall({ variables: { where: { id: scheduleCall.id } } });
      await refetch();
      await Swal.fire({
        icon: "success",
        title: "Restored",
        text: "Scheduled call restored successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to restore scheduled call.";
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setPage(1);
  };

  return {
    scheduleCalls,
    total,
    loading: !canFetch || loading,
    error,
    searchInput,
    setSearchInput,
    page,
    setPage,
    pageSize: SCHEDULE_CALLS_PAGE_SIZE,
    isSearching,
    canFetch,
    restore,
    clearFilters,
  };
}
