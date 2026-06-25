"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { BLOGS_LIST_QUERY } from "@/graphql/documents/blogs";
import { BLOGS_PAGE_SIZE } from "@/modules/blog/constants";
import { useAuthenticatedAdminQuery } from "@/modules/blog/hooks/useAuthenticatedAdminQuery";
import type { BlogsListResult } from "@/modules/blog/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useBlogsList() {
  const { canFetch } = useAuthenticatedAdminQuery();
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);
  const isSearching = Boolean(searchQuery);

  const queryVariables = useMemo(
    () => ({
      search: searchQuery || undefined,
      skip: isSearching ? undefined : (page - 1) * BLOGS_PAGE_SIZE,
      take: isSearching ? undefined : BLOGS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" as const }],
    }),
    [isSearching, page, searchQuery]
  );

  const { data, loading, error, refetch } = useQuery<BlogsListResult>(
    BLOGS_LIST_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch,
      fetchPolicy: "network-only",
    }
  );

  const blogs = useMemo(() => data?.blogs?.blogs ?? [], [data?.blogs?.blogs]);
  const total = data?.blogs?.blogCount ?? 0;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return {
    blogs,
    total,
    loading: !canFetch || loading,
    error,
    refetch,
    searchInput,
    setSearchInput,
    page,
    setPage,
    pageSize: BLOGS_PAGE_SIZE,
    isSearching,
    canFetch,
  };
}
