"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { ARCHIVE_EVENTS_QUERY } from "@/graphql/documents/archive-events";
import {
  ARCHIVE_EVENTS_PAGE_SIZE,
  type ArchiveEventsQueryVariables,
  type ArchiveEventsResult,
  type EventArchiveWhereInput,
} from "@/modules/archive-events/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useArchiveEventsList() {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [locationId, setLocationId] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [page, setPage] = useState(1);

  const where = useMemo((): EventArchiveWhereInput | undefined => {
    const filter: EventArchiveWhereInput = {};
    if (locationId) filter.locationId = locationId;
    if (sellerId) filter.sellerId = sellerId;
    return Object.keys(filter).length > 0 ? filter : undefined;
  }, [locationId, sellerId]);

  const queryVariables = useMemo((): ArchiveEventsQueryVariables => {
    return {
      orderBy: [{ archivedAt: "DESC" }],
      take: ARCHIVE_EVENTS_PAGE_SIZE,
      skip: (page - 1) * ARCHIVE_EVENTS_PAGE_SIZE,
      search: searchQuery || undefined,
      where,
    };
  }, [page, searchQuery, where]);

  const { data, loading, error, refetch } = useQuery<ArchiveEventsResult>(
    ARCHIVE_EVENTS_QUERY,
    {
      variables: queryVariables,
      fetchPolicy: "network-only",
    }
  );

  const events = useMemo(
    () => data?.eventArchived?.eventArchived ?? [],
    [data?.eventArchived?.eventArchived]
  );
  const total = data?.eventArchived?.eventArchiveCount ?? 0;

  const clearFilters = () => {
    setLocationId("");
    setSellerId("");
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, locationId, sellerId]);

  return {
    events,
    total,
    loading,
    error,
    refetch,
    searchInput,
    setSearchInput,
    locationId,
    setLocationId,
    sellerId,
    setSellerId,
    page,
    setPage,
    pageSize: ARCHIVE_EVENTS_PAGE_SIZE,
    clearFilters,
    searchQuery,
  };
}
