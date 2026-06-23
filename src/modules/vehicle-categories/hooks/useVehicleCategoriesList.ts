"use client";

import { useQuery } from "@apollo/client";
import { VEHICLE_CATEGORIES_QUERY } from "@/graphql/documents/vehicle-categories";
import type { VehicleCategoriesResult } from "@/modules/vehicle-categories/types";

export function useVehicleCategoriesList() {
  const { data, loading, error, refetch } = useQuery<VehicleCategoriesResult>(
    VEHICLE_CATEGORIES_QUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const categories = data?.vehicleCategories ?? [];

  return {
    categories,
    loading,
    error,
    refetch,
  };
}
