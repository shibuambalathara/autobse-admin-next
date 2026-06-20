"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { NEW_EVENTS_LISTING_QUERY } from "@/graphql/documents/events";
import { EVENTS_PAGE_SIZE } from "@/modules/events/constants";
import type {
  EventCategory,
  EventStatusType,
  EventWhereUniqueInput,
  NewEventsListingResult,
  NewEventsListingVariables,
} from "@/modules/events/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useEventsList() {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [eventCategory, setEventCategory] = useState<EventCategory | "">("");
  const [status, setStatus] = useState<EventStatusType | "">("");
  const [startDate, setStartDate] = useState("");
  const [locationId, setLocationId] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [vehicleCategoryId, setVehicleCategoryId] = useState("");
  const [page, setPage] = useState(1);

  const eventsFilterWhere = useMemo((): EventWhereUniqueInput | undefined => {
    const where: EventWhereUniqueInput = {};
    if (startDate) {
      where.startDate = new Date(startDate).toISOString();
    }
    if (locationId) where.locationId = locationId;
    if (sellerId) where.sellerId = sellerId;
    if (eventCategory) where.eventCategory = eventCategory;
    if (status) where.status = status;
    if (vehicleCategoryId) where.vehicleCategoryId = vehicleCategoryId;
    return Object.keys(where).length > 0 ? where : undefined;
  }, [
    startDate,
    locationId,
    sellerId,
    eventCategory,
    status,
    vehicleCategoryId,
  ]);

  const queryVariables = useMemo((): NewEventsListingVariables => {
    return {
      where: eventsFilterWhere,
      search: searchQuery || undefined,
      skip: (page - 1) * EVENTS_PAGE_SIZE,
      take: EVENTS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" }],
    };
  }, [page, searchQuery, eventsFilterWhere]);

  const { data, loading, refetch } = useQuery<NewEventsListingResult>(
    NEW_EVENTS_LISTING_QUERY,
    {
      variables: queryVariables,
      fetchPolicy: "network-only",
    }
  );

  const events = useMemo(
    () => data?.eventsData?.events ?? [],
    [data?.eventsData?.events]
  );
  const total = data?.eventsData?.eventCount ?? 0;

  const clearFilters = () => {
    setEventCategory("");
    setStatus("");
    setStartDate("");
    setLocationId("");
    setSellerId("");
    setVehicleCategoryId("");
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [
    searchQuery,
    eventCategory,
    status,
    startDate,
    locationId,
    sellerId,
    vehicleCategoryId,
  ]);

  return {
    events,
    total,
    loading,
    refetch,
    searchInput,
    setSearchInput,
    eventCategory,
    setEventCategory,
    status,
    setStatus,
    startDate,
    setStartDate,
    locationId,
    setLocationId,
    sellerId,
    setSellerId,
    vehicleCategoryId,
    setVehicleCategoryId,
    page,
    setPage,
    pageSize: EVENTS_PAGE_SIZE,
    clearFilters,
    searchQuery,
  };
}
