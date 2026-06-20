"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  EVENT_VEHICLES_HEADER_QUERY,
  VEHICLES_LIST_QUERY,
} from "@/graphql/documents/vehicles";
import { EVENT_VEHICLES_PAGE_SIZE } from "@/modules/event-vehicles/constants";
import type {
  EventVehiclesHeaderResult,
  VehiclesListResult,
  VehiclesListVariables,
} from "@/modules/event-vehicles/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useEventVehiclesList(eventId: string) {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);

  const { data: eventData, loading: eventLoading } =
    useQuery<EventVehiclesHeaderResult>(EVENT_VEHICLES_HEADER_QUERY, {
      variables: { where: { id: eventId } },
      skip: !eventId,
    });

  const queryVariables = useMemo((): VehiclesListVariables => {
    const isSearching = Boolean(searchQuery);
    return {
      where: { event: { id: eventId } },
      orderBy: [{ bidTimeExpire: "ASC" }],
      search: searchQuery || undefined,
      take: isSearching ? undefined : EVENT_VEHICLES_PAGE_SIZE,
      skip: isSearching ? undefined : (page - 1) * EVENT_VEHICLES_PAGE_SIZE,
    };
  }, [eventId, page, searchQuery]);

  const {
    data: vehiclesData,
    loading: vehiclesLoading,
    refetch,
  } = useQuery<VehiclesListResult>(VEHICLES_LIST_QUERY, {
    variables: queryVariables,
    skip: !eventId,
    fetchPolicy: "network-only",
  });

  const event = eventData?.event;
  const vehicles = useMemo(
    () => vehiclesData?.vehicles?.vehicles ?? [],
    [vehiclesData?.vehicles?.vehicles]
  );
  const total = vehiclesData?.vehicles?.vehiclesCount ?? 0;

  const clearFilters = () => {
    setSearchInput("");
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const isEventActive = event?.endDate
    ? new Date(event.endDate) > new Date()
    : false;

  return {
    event,
    vehicles,
    total,
    loading: eventLoading || vehiclesLoading,
    refetch,
    searchInput,
    setSearchInput,
    page,
    setPage,
    pageSize: EVENT_VEHICLES_PAGE_SIZE,
    clearFilters,
    isEventActive,
  };
}
