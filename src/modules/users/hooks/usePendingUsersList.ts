"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { PENDING_USERS_QUERY } from "@/graphql/documents/users";
import { USERS_PAGE_SIZE } from "@/modules/users/constants";
import type { PendingUsersQueryResult } from "@/modules/users/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function usePendingUsersList() {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);

  const variables = useMemo(
    () => ({
      where: state ? { state } : undefined,
      skip: searchQuery ? undefined : (page - 1) * USERS_PAGE_SIZE,
      take: searchQuery ? undefined : USERS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" as const }],
      search: searchQuery || undefined,
    }),
    [page, searchQuery, state]
  );

  const { data, loading, error } = useQuery<PendingUsersQueryResult>(
    PENDING_USERS_QUERY,
    { variables, fetchPolicy: "network-only" }
  );

  const users = data?.getPendingUsers?.pendingUsers ?? [];
  const total = data?.getPendingUsers?.pendingUsersCount ?? 0;

  const clearFilters = () => {
    setSearchInput("");
    setState("");
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, state]);

  return {
    users,
    total,
    loading,
    error,
    searchInput,
    setSearchInput,
    state,
    setState,
    page,
    setPage,
    pageSize: USERS_PAGE_SIZE,
    clearFilters,
  };
}
