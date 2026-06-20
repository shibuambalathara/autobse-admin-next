"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  LOCATIONS_FILTER_QUERY,
  SELLERS_FILTER_QUERY,
  VEHICLE_CATEGORIES_QUERY,
} from "@/graphql/documents/events";
import type {
  EventFilterOption,
  LocationsFilterResult,
  SellersFilterResult,
  VehicleCategoriesResult,
} from "@/modules/events/types";

function toSelectOptions(
  items: Array<{ id: string; name?: string | null }>
): EventFilterOption[] {
  return items.map((item) => ({
    value: item.id,
    label: item.name ?? item.id,
  }));
}

export function useEventFilterOptions() {
  const { data: locationsData } = useQuery<LocationsFilterResult>(
    LOCATIONS_FILTER_QUERY
  );
  const { data: sellersData } = useQuery<SellersFilterResult>(
    SELLERS_FILTER_QUERY
  );
  const { data: vehicleCategoriesData } = useQuery<VehicleCategoriesResult>(
    VEHICLE_CATEGORIES_QUERY
  );

  const locationOptions = useMemo(
    () => toSelectOptions(locationsData?.locations?.locations ?? []),
    [locationsData]
  );

  const sellerOptions = useMemo(
    () => toSelectOptions(sellersData?.sellers ?? []),
    [sellersData]
  );

  const vehicleCategoryOptions = useMemo(
    () => toSelectOptions(vehicleCategoriesData?.vehicleCategories ?? []),
    [vehicleCategoriesData]
  );

  return {
    locationOptions,
    sellerOptions,
    vehicleCategoryOptions,
  };
}
