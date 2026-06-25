"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  CAREERS_LIST_QUERY,
  DISTINCT_LOCATIONS_QUERY,
} from "@/graphql/documents/careers";
import { CAREERS_PAGE_SIZE } from "@/modules/career/constants";
import { useAuthenticatedAdminQuery } from "@/modules/career/hooks/useAuthenticatedAdminQuery";
import type {
  CareerUrgency,
  CareersListResult,
  CareersQueryVariables,
  DistinctLocationsResult,
  JobDepartment,
  JobType,
} from "@/modules/career/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useCareersList() {
  const { canFetch } = useAuthenticatedAdminQuery();
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [category, setCategory] = useState<JobDepartment | "">("");
  const [type, setType] = useState<JobType | "">("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState<CareerUrgency | "">("");
  const [page, setPage] = useState(1);
  const isSearching = Boolean(searchQuery);

  const { data: locationData } = useQuery<DistinctLocationsResult>(
    DISTINCT_LOCATIONS_QUERY,
    {
      skip: !canFetch,
      fetchPolicy: "cache-first",
    }
  );

  const queryVariables = useMemo((): CareersQueryVariables => {
    const where: CareersQueryVariables["where"] = {};
    if (category) where.category = category;
    if (type) where.type = type;
    if (location) where.location = location;
    if (urgency) where.urgency = urgency;

    return {
      where: Object.keys(where).length > 0 ? where : undefined,
      search: searchQuery || undefined,
      skip: isSearching ? undefined : (page - 1) * CAREERS_PAGE_SIZE,
      take: isSearching ? undefined : CAREERS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" }],
    };
  }, [category, isSearching, location, page, searchQuery, type, urgency]);

  const { data, loading, error, refetch } = useQuery<CareersListResult>(
    CAREERS_LIST_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch,
      fetchPolicy: "network-only",
    }
  );

  const careers = useMemo(
    () => data?.careers?.careers ?? [],
    [data?.careers?.careers]
  );
  const total = data?.careers?.careerCount ?? 0;
  const locationOptions = useMemo(
    () =>
      (locationData?.distinctLocations ?? []).map((loc) => ({
        label: loc,
        value: loc,
      })),
    [locationData?.distinctLocations]
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, category, type, location, urgency]);

  const clearFilters = () => {
    setSearchInput("");
    setCategory("");
    setType("");
    setLocation("");
    setUrgency("");
    setPage(1);
  };

  return {
    careers,
    total,
    loading: !canFetch || loading,
    error,
    refetch,
    searchInput,
    setSearchInput,
    category,
    setCategory,
    type,
    setType,
    location,
    setLocation,
    urgency,
    setUrgency,
    locationOptions,
    page,
    setPage,
    pageSize: CAREERS_PAGE_SIZE,
    isSearching,
    canFetch,
    clearFilters,
  };
}
