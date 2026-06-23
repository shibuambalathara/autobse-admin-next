"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { LOCATIONS_LIST_QUERY } from "@/graphql/documents/locations";
import { LOCATIONS_PAGE_SIZE } from "@/modules/locations/constants";
import type {
  ListLocationsVariables,
  LocationsListResult,
} from "@/modules/locations/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useLocationsList() {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [stateFilter, setStateFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = LOCATIONS_PAGE_SIZE;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, stateFilter]);

  const variables = useMemo((): ListLocationsVariables => {
    const where = stateFilter ? { state: stateFilter } : undefined;
    const isSearching = Boolean(searchQuery);

    return {
      where,
      search: searchQuery || undefined,
      orderBy: [{ name: "ASC" }],
      skip: isSearching ? undefined : (page - 1) * pageSize,
      take: isSearching ? undefined : pageSize,
    };
  }, [stateFilter, searchQuery, page, pageSize]);

  const { data, loading, error, refetch } = useQuery<LocationsListResult>(
    LOCATIONS_LIST_QUERY,
    {
      variables,
      fetchPolicy: "network-only",
    }
  );

  const locations = data?.locations?.locations ?? [];
  const total = data?.locations?.locationsCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const clearFilters = () => {
    setSearchInput("");
    setStateFilter("");
    setPage(1);
  };

  return {
    locations,
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
    stateFilter,
    setStateFilter: (value: string) => {
      setStateFilter(value);
      setPage(1);
    },
    clearFilters,
    page: currentPage,
    setPage,
    pageSize,
    totalPages,
    isSearching: Boolean(searchQuery),
  };
}
