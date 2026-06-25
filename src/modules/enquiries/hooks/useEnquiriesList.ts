"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { useAuth } from "@/auth/use-auth";
import { APP_ROLES, isRole } from "@/auth/roles";
import { useAccess } from "@/auth/use-access";
import { ENQUIRIES_QUERY } from "@/graphql/documents/enquiries";
import { ENQUIRIES_PAGE_SIZE } from "@/modules/enquiries/constants";
import type {
  EnquiriesQueryVariables,
  EnquiriesResult,
  EnquiryStatus,
} from "@/modules/enquiries/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useEnquiriesList() {
  const { isAuthenticated, isInitializing, isRefreshing, accessToken } =
    useAuth();
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const canFetch =
    isAdmin &&
    isAuthenticated &&
    !isInitializing &&
    !isRefreshing &&
    Boolean(accessToken);

  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | "">("");
  const [stateFilter, setStateFilter] = useState("");
  const [page, setPage] = useState(1);

  const isSearching = Boolean(searchQuery);

  const queryVariables = useMemo((): EnquiriesQueryVariables => {
    const where: EnquiriesQueryVariables["where"] = {};
    if (stateFilter) where.state = stateFilter;
    if (statusFilter) where.status = statusFilter;

    return {
      where: Object.keys(where).length > 0 ? where : undefined,
      search: searchQuery || undefined,
      skip: isSearching ? undefined : (page - 1) * ENQUIRIES_PAGE_SIZE,
      take: isSearching ? undefined : ENQUIRIES_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" }],
    };
  }, [isSearching, page, searchQuery, stateFilter, statusFilter]);

  const { data, loading, error, refetch } = useQuery<EnquiriesResult>(
    ENQUIRIES_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch,
      fetchPolicy: "network-only",
    }
  );

  const enquiries = useMemo(
    () => data?.Enquiries?.enquiry ?? [],
    [data?.Enquiries?.enquiry]
  );
  const total = data?.Enquiries?.enquiryCount ?? 0;

  const clearFilters = () => {
    setSearchInput("");
    setStatusFilter("");
    setStateFilter("");
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, stateFilter]);

  return {
    enquiries,
    total,
    loading: !canFetch || loading,
    error,
    refetch,
    canFetch,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    stateFilter,
    setStateFilter,
    page,
    setPage,
    pageSize: ENQUIRIES_PAGE_SIZE,
    clearFilters,
    searchQuery,
    isSearching,
  };
}
