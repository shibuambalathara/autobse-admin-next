"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { AUTO_EVENTS_LIST_QUERY } from "@/graphql/documents/event-bots";
import { SELLERS_FILTER_QUERY } from "@/graphql/documents/events";
import { EVENT_BOTS_PAGE_SIZE } from "@/modules/event-bots/constants";
import type {
  AutoEventsListResult,
  AutoEventsListVariables,
  EventBotItem,
} from "@/modules/event-bots/types";
import type { EventCategory } from "@/modules/events/types";
import type { SellersFilterResult } from "@/modules/events/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";
import { useResetPageOnFilterChange } from "@/modules/event-bots/hooks/useEventBotActions";

export function useEventBotsList() {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [sellerId, setSellerId] = useState("");
  const [eventCategory, setEventCategory] = useState<EventCategory | "">("");
  const [startDate, setStartDate] = useState("");
  const [page, setPage] = useState(1);

  useResetPageOnFilterChange(
    [searchQuery, sellerId, eventCategory, startDate],
    setPage
  );

  const where = useMemo(() => {
    const filter: AutoEventsListVariables["where"] = {};
    if (sellerId) filter.sellerId = sellerId;
    if (eventCategory) filter.eventCategory = eventCategory;
    if (startDate) filter.startDate = new Date(startDate).toISOString();
    return Object.keys(filter).length > 0 ? filter : undefined;
  }, [sellerId, eventCategory, startDate]);

  const queryVariables = useMemo(
    (): AutoEventsListVariables => ({
      where,
      search: searchQuery || undefined,
      skip: (page - 1) * EVENT_BOTS_PAGE_SIZE,
      take: EVENT_BOTS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" }],
    }),
    [where, searchQuery, page]
  );

  const { data, loading, refetch } = useQuery<AutoEventsListResult>(
    AUTO_EVENTS_LIST_QUERY,
    {
      variables: queryVariables,
      fetchPolicy: "network-only",
    }
  );

  const { data: sellersData } = useQuery<SellersFilterResult>(
    SELLERS_FILTER_QUERY
  );

  const eventBots = useMemo(
    (): EventBotItem[] => data?.AutoEvents?.autoEvents ?? [],
    [data?.AutoEvents?.autoEvents]
  );

  const total = data?.AutoEvents?.autoEventCount ?? 0;
  const sellers = sellersData?.sellers ?? [];

  const clearFilters = () => {
    setSellerId("");
    setEventCategory("");
    setStartDate("");
    setPage(1);
  };

  return {
    searchInput,
    setSearchInput,
    sellerId,
    setSellerId,
    eventCategory,
    setEventCategory,
    startDate,
    setStartDate,
    page,
    setPage,
    pageSize: EVENT_BOTS_PAGE_SIZE,
    eventBots,
    total,
    loading,
    refetch,
    sellers,
    clearFilters,
  };
}
