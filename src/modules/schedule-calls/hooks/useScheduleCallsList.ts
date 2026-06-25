"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { SCHEDULE_CALLS_LIST_QUERY } from "@/graphql/documents/schedule-calls";
import {
  DEFAULT_SCHEDULE_CALL_STATUS,
  SCHEDULE_CALLS_PAGE_SIZE,
} from "@/modules/schedule-calls/constants";
import { useAuthenticatedAdminQuery } from "@/modules/schedule-calls/hooks/useAuthenticatedAdminQuery";
import type {
  CallScheduleStatus,
  ScheduleCallsListResult,
  ScheduleCallsQueryVariables,
} from "@/modules/schedule-calls/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useScheduleCallsList() {
  const { canFetch } = useAuthenticatedAdminQuery();
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [status, setStatus] = useState<CallScheduleStatus>(
    DEFAULT_SCHEDULE_CALL_STATUS
  );
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);
  const isSearching = Boolean(searchQuery);

  const queryVariables = useMemo((): ScheduleCallsQueryVariables => {
    const where: ScheduleCallsQueryVariables["where"] = {
      status,
    };
    if (state) where.state = state;

    return {
      where,
      search: searchQuery || undefined,
      skip: isSearching ? undefined : (page - 1) * SCHEDULE_CALLS_PAGE_SIZE,
      take: isSearching ? undefined : SCHEDULE_CALLS_PAGE_SIZE,
      orderBy: [{ PreferredDate: "ASC" }],
    };
  }, [isSearching, page, searchQuery, state, status]);

  const { data, loading, error, refetch } = useQuery<ScheduleCallsListResult>(
    SCHEDULE_CALLS_LIST_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch,
      fetchPolicy: "network-only",
    }
  );

  const scheduleCalls = useMemo(
    () => data?.scheduleCalls?.schedulecalls ?? [],
    [data?.scheduleCalls?.schedulecalls]
  );
  const total = data?.scheduleCalls?.schedulecallCount ?? 0;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, status, state]);

  const clearFilters = () => {
    setSearchInput("");
    setStatus(DEFAULT_SCHEDULE_CALL_STATUS);
    setState("");
    setPage(1);
  };

  return {
    scheduleCalls,
    total,
    loading: !canFetch || loading,
    error,
    refetch,
    searchInput,
    setSearchInput,
    status,
    setStatus,
    state,
    setState,
    page,
    setPage,
    pageSize: SCHEDULE_CALLS_PAGE_SIZE,
    isSearching,
    canFetch,
    clearFilters,
  };
}
