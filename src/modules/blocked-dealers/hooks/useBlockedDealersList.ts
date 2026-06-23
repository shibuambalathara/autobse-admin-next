"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { LIST_BLOCKED_DEALERS_QUERY } from "@/graphql/documents/blocked-dealers";
import { BLOCKED_DEALERS_PAGE_SIZE } from "@/modules/blocked-dealers/constants";
import type {
  BlockedDealersListResult,
  ListBlockedDealersVariables,
} from "@/modules/blocked-dealers/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

interface UseBlockedDealersListOptions {
  sellerId?: string;
  pancardNo?: string;
  enabled?: boolean;
}

export function useBlockedDealersList(options: UseBlockedDealersListOptions = {}) {
  const { sellerId, pancardNo, enabled = true } = options;
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);
  const pageSize = BLOCKED_DEALERS_PAGE_SIZE;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, sellerId, pancardNo]);

  const where = useMemo(() => {
    if (sellerId) return { sellerId };
    if (pancardNo) return { pancardNo };
    return undefined;
  }, [sellerId, pancardNo]);

  const variables = useMemo((): ListBlockedDealersVariables => {
    return {
      where,
      orderBy: { createdAt: "DESC" },
      take: pageSize,
      skip: (page - 1) * pageSize,
      search: searchQuery || undefined,
    };
  }, [where, page, pageSize, searchQuery]);

  const { data, loading, error, refetch } = useQuery<BlockedDealersListResult>(
    LIST_BLOCKED_DEALERS_QUERY,
    {
      variables,
      fetchPolicy: "network-only",
      skip: !enabled,
    }
  );

  const dealers = data?.getBlockedDealers?.blockedDealer ?? [];
  const total = data?.getBlockedDealers?.blockedCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setPage(1);
  }, []);

  return {
    dealers,
    total,
    loading,
    error,
    refetch,
    searchInput,
    setSearchInput: (value: string) => {
      setSearchInput(value);
      setPage(1);
    },
    searchQuery,
    clearSearch,
    page: currentPage,
    setPage,
    pageSize,
    totalPages,
  };
}
