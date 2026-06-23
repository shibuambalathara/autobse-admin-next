"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { DELETED_CRM_LIST_QUERY } from "@/graphql/documents/crm";
import { CRM_PAGE_SIZE } from "@/modules/crm/constants";
import { useCrmFilterOptions } from "@/modules/crm/hooks/useCrmFilterOptions";
import { useResetCrmPageOnFilterChange } from "@/modules/crm/hooks/useCrmFilterOptions";
import type { DeletedCrmListResult } from "@/modules/crm/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useDeletedCrmList() {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);

  const filterOptions = useCrmFilterOptions("");

  useResetCrmPageOnFilterChange([searchQuery], setPage);

  const queryVariables = useMemo(
    () => ({
      search: searchQuery || undefined,
      skip: searchQuery ? undefined : (page - 1) * CRM_PAGE_SIZE,
      take: searchQuery ? undefined : CRM_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" as const }],
    }),
    [page, searchQuery]
  );

  const { data, loading, refetch } = useQuery<DeletedCrmListResult>(
    DELETED_CRM_LIST_QUERY,
    {
      variables: queryVariables,
      fetchPolicy: "network-only",
    }
  );

  const clients = data?.deletedPotentialClients?.potentialClients ?? [];
  const total = data?.deletedPotentialClients?.deletedClientCount ?? 0;

  const clearFilters = () => {
    setSearchInput("");
    setPage(1);
  };

  return {
    searchInput,
    setSearchInput,
    page,
    setPage,
    pageSize: CRM_PAGE_SIZE,
    clients,
    total,
    loading,
    refetch,
    clearFilters,
    filterOptions,
  };
}
