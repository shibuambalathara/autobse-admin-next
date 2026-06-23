"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  DELETED_CRM_CALL_LOG_LIST_QUERY,
  INDIVIDUAL_CRM_QUERY,
} from "@/graphql/documents/crm";
import { CRM_PAGE_SIZE } from "@/modules/crm/constants";
import {
  useCrmFilterOptions,
  useResetCrmPageOnFilterChange,
} from "@/modules/crm/hooks/useCrmFilterOptions";
import type {
  CallLogPageFilters,
  DeletedCrmCallLogListResult,
  IndividualCrmResult,
  PotentialClientCallLogWhereInput,
} from "@/modules/crm/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

const emptyFilters: CallLogPageFilters = {
  callStatus: undefined,
  staffId: undefined,
  nextFollowUpAt: undefined,
};

export function useDeletedCrmCallLogsList(clientId: string) {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [filters, setFilters] = useState<CallLogPageFilters>(emptyFilters);
  const [page, setPage] = useState(1);

  const filterOptions = useCrmFilterOptions("");

  useResetCrmPageOnFilterChange(
    [searchQuery, filters.callStatus, filters.staffId],
    setPage
  );

  const where = useMemo((): PotentialClientCallLogWhereInput | undefined => {
    const active: PotentialClientCallLogWhereInput = {
      potentialClientId: clientId,
    };
    if (filters.callStatus) active.callStatus = filters.callStatus;
    if (filters.staffId) active.staffId = filters.staffId;
    return active;
  }, [clientId, filters]);

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
      skip: !clientId,
      fetchPolicy: "network-only",
    }
  );

  const { data, loading, refetch } = useQuery<DeletedCrmCallLogListResult>(
    DELETED_CRM_CALL_LOG_LIST_QUERY,
    {
      variables: queryVariables,
      skip: !clientId,
      fetchPolicy: "network-only",
    }
  );

  const callLogs = data?.deletedPotentialClientCallLogs?.callLogs ?? [];
  const total = data?.deletedPotentialClientCallLogs?.callLogCount ?? 0;
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
    : "Buyer";

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
  };
}
