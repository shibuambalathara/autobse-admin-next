"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { STATES_QUERY } from "@/graphql/documents/users";
import { VEHICLE_CATEGORIES_QUERY } from "@/graphql/documents/events";
import {
  FILTER_LOCATIONS_QUERY,
  STAFF_USERS_QUERY,
} from "@/graphql/documents/crm";
import { STAFF_USERS_QUERY_VARIABLES } from "@/modules/crm/constants";
import type {
  CrmFilterOption,
  FilterLocationsResult,
  StaffUsersResult,
} from "@/modules/crm/types";
import { formatStateDisplay } from "@/modules/users/utils";

interface StatesQueryResult {
  States: { id: string; name: string }[];
}

interface VehicleCategoriesResult {
  vehicleCategories: { id: string; name: string }[];
}

export function useCrmFilterOptions(stateId: string) {
  const { data: statesData } = useQuery<StatesQueryResult>(STATES_QUERY, {
    fetchPolicy: "cache-first",
  });

  const { data: vehicleCategoryData } = useQuery<VehicleCategoriesResult>(
    VEHICLE_CATEGORIES_QUERY,
    { fetchPolicy: "network-only" }
  );

  const { data: staffData } = useQuery<StaffUsersResult>(STAFF_USERS_QUERY, {
    variables: STAFF_USERS_QUERY_VARIABLES,
    fetchPolicy: "network-only",
  });

  const selectedStateName = useMemo(() => {
    if (!stateId) return undefined;
    return statesData?.States?.find((state) => state.id === stateId)?.name;
  }, [stateId, statesData]);

  const { data: locationsData, loading: locationsLoading } =
    useQuery<FilterLocationsResult>(FILTER_LOCATIONS_QUERY, {
      variables: selectedStateName
        ? { where: { state: selectedStateName } }
        : undefined,
      skip: !selectedStateName,
      fetchPolicy: "network-only",
    });

  const stateOptions = useMemo((): CrmFilterOption[] => {
    return (
      statesData?.States?.map((state) => ({
        value: state.id,
        label: formatStateDisplay(state.name),
      })) ?? []
    );
  }, [statesData]);

  const stateNameById = useMemo(() => {
    const map: Record<string, string> = {};
    statesData?.States?.forEach((state) => {
      if (state.id && state.name) map[state.id] = state.name;
    });
    return map;
  }, [statesData]);

  const locationOptions = useMemo((): CrmFilterOption[] => {
    return (
      locationsData?.locations?.locations?.map((loc) => ({
        value: loc.id,
        label: loc.name,
      })) ?? []
    );
  }, [locationsData]);

  const vehicleCategoryOptions = useMemo((): CrmFilterOption[] => {
    return (
      vehicleCategoryData?.vehicleCategories?.map((category) => ({
        value: category.id,
        label: category.name,
      })) ?? []
    );
  }, [vehicleCategoryData]);

  const staffOptions = useMemo((): CrmFilterOption[] => {
    return (
      staffData?.users?.users?.map((staff) => ({
        value: staff.id,
        label:
          [staff.firstName, staff.lastName].filter(Boolean).join(" ") ||
          staff.mobile ||
          staff.id,
      })) ?? []
    );
  }, [staffData]);

  const staffNameById = useMemo(() => {
    const map: Record<string, string> = {};
    staffData?.users?.users?.forEach((staff) => {
      if (staff.id) {
        map[staff.id] =
          [staff.firstName, staff.lastName].filter(Boolean).join(" ") ||
          staff.mobile ||
          staff.id;
      }
    });
    return map;
  }, [staffData]);

  return {
    stateOptions,
    stateNameById,
    locationOptions,
    vehicleCategoryOptions,
    staffOptions,
    staffNameById,
    locationsLoading,
    statesLoading: !statesData,
  };
}

export function useResetCrmPageOnFilterChange(
  deps: unknown[],
  setPage: (page: number) => void
) {
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
