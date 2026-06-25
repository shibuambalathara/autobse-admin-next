"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { JOB_APPLICATIONS_LIST_QUERY } from "@/graphql/documents/job-applications";
import { JOB_APPLICATIONS_PAGE_SIZE } from "@/modules/job-applications/constants";
import { useAuthenticatedAdminQuery } from "@/modules/job-applications/hooks/useAuthenticatedAdminQuery";
import type {
  JobApplicationStatus,
  JobApplicationsListResult,
  JobApplicationsQueryVariables,
} from "@/modules/job-applications/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

interface UseJobApplicationsListOptions {
  careerId?: string;
}

export function useJobApplicationsList(options: UseJobApplicationsListOptions = {}) {
  const { careerId } = options;
  const { canFetch } = useAuthenticatedAdminQuery();
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [status, setStatus] = useState<JobApplicationStatus | "">("");
  const [page, setPage] = useState(1);
  const isSearching = Boolean(searchQuery);

  const queryVariables = useMemo((): JobApplicationsQueryVariables => {
    const where: JobApplicationsQueryVariables["where"] = {};
    if (status) where.status = status;
    if (careerId) where.career = { id: careerId };

    return {
      where: Object.keys(where).length > 0 ? where : undefined,
      search: searchQuery || undefined,
      skip: isSearching ? undefined : (page - 1) * JOB_APPLICATIONS_PAGE_SIZE,
      take: isSearching ? undefined : JOB_APPLICATIONS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" }],
    };
  }, [careerId, isSearching, page, searchQuery, status]);

  const { data, loading, error, refetch } = useQuery<JobApplicationsListResult>(
    JOB_APPLICATIONS_LIST_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch,
      fetchPolicy: "network-only",
    }
  );

  const applications = useMemo(
    () => data?.jobs?.jobs ?? [],
    [data?.jobs?.jobs]
  );
  const total = data?.jobs?.jobCount ?? applications.length;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, status, careerId]);

  const clearFilters = () => {
    setSearchInput("");
    setStatus("");
    setPage(1);
  };

  return {
    applications,
    total,
    loading: !canFetch || loading,
    error,
    refetch,
    searchInput,
    setSearchInput,
    status,
    setStatus,
    page,
    setPage,
    pageSize: JOB_APPLICATIONS_PAGE_SIZE,
    isSearching,
    canFetch,
    clearFilters,
  };
}
