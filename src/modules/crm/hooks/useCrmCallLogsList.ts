"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { useAuth } from "@/auth/use-auth";
import { useAuthenticatedQuery } from "@/auth/use-authenticated-query";
import { APP_ROLES } from "@/auth/roles";
import {
  CRM_CALL_LOG_LIST_QUERY,
  INDIVIDUAL_CRM_QUERY,
} from "@/graphql/documents/crm";
import { CRM_PAGE_SIZE } from "@/modules/crm/constants";
import {
  useCrmFilterOptions,
  useResetCrmPageOnFilterChange,
} from "@/modules/crm/hooks/useCrmFilterOptions";
import type {
  CallLogPageFilters,
  CrmCallLogListResult,
  IndividualCrmResult,
  PotentialClientCallLogWhereInput,
} from "@/modules/crm/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

const emptyFilters: CallLogPageFilters = {
  callStatus: undefined,
  staffId: undefined,
  nextFollowUpAt: undefined,
};

export function useCrmCallLogsList(clientId: string) {
  const { user } = useAuth();
  const { canFetch } = useAuthenticatedQuery();
  const isStaff = user?.role?.toLowerCase() === APP_ROLES.STAFF;
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [filters, setFilters] = useState<CallLogPageFilters>(emptyFilters);
  const [page, setPage] = useState(1);

  const filterOptions = useCrmFilterOptions("");

  useEffect(() => {
    if (!isStaff) return;
    setFilters((prev) =>
      prev.staffId ? { ...prev, staffId: undefined } : prev
    );
  }, [isStaff]);

  useResetCrmPageOnFilterChange(
    [
      searchQuery,
      filters.callStatus,
      filters.staffId,
      filters.nextFollowUpAt,
    ],
    setPage
  );

  const where = useMemo((): PotentialClientCallLogWhereInput | undefined => {
    const active: PotentialClientCallLogWhereInput = {
      potentialClientId: clientId,
    };
    if (filters.callStatus) active.callStatus = filters.callStatus;
    if (!isStaff && filters.staffId) active.staffId = filters.staffId;
    if (filters.nextFollowUpAt) active.nextFollowUpAt = filters.nextFollowUpAt;
    return active;
  }, [clientId, filters, isStaff]);

  const queryVariables = useMemo(
    () => ({
      where,
      search: searchQuery || undefined,
      skip: searchQuery ? undefined : (page - 1) * CRM_PAGE_SIZE,
      take: searchQuery ? undefined : CRM_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" as const }],
    }),
    [where, searchQuery, page]
  );

  const { data: clientData } = useQuery<IndividualCrmResult>(
    INDIVIDUAL_CRM_QUERY,
    {
      variables: { where: { id: clientId } },
      skip: !canFetch || !clientId,
      fetchPolicy: "cache-first",
    }
  );

  const { data, loading, refetch } = useQuery<CrmCallLogListResult>(
    CRM_CALL_LOG_LIST_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch || !clientId,
      fetchPolicy: "network-only",
    }
  );

  const callLogs = data?.potentialClientCallLogs?.callLogs ?? [];
  const total = data?.potentialClientCallLogs?.callLogCount ?? 0;
  const client = clientData?.potentialClient;

  const setFilter = useCallback(
    (name: keyof CallLogPageFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [name]: value || undefined }));
    },
    []
  );

  const clearFilters = () => {
    setSearchInput("");
    setFilters(emptyFilters);
    setPage(1);
  };

  const clientLabel = client
    ? [client.firstName, client.lastName].filter(Boolean).join(" ") ||
      client.mobile
    : "Client";

  return {
    searchInput,
    setSearchInput,
    filters,
    setFilter,
    page,
    setPage,
    pageSize: CRM_PAGE_SIZE,
    callLogs,
    total,
    loading,
    refetch,
    clearFilters,
    filterOptions,
    clientLabel,
    isStaff,
  };
}
