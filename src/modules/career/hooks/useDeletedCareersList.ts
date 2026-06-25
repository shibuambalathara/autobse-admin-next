"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import {
  DELETED_CAREERS_QUERY,
  RESTORE_CAREER_MUTATION,
} from "@/graphql/documents/careers";
import { CAREERS_PAGE_SIZE } from "@/modules/career/constants";
import { useAuthenticatedAdminQuery } from "@/modules/career/hooks/useAuthenticatedAdminQuery";
import type { Career, DeletedCareersResult } from "@/modules/career/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useDeletedCareersList() {
  const { canFetch } = useAuthenticatedAdminQuery();
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);
  const isSearching = Boolean(searchQuery);

  const queryVariables = useMemo(
    () => ({
      search: searchQuery || undefined,
      skip: isSearching ? undefined : (page - 1) * CAREERS_PAGE_SIZE,
      take: isSearching ? undefined : CAREERS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" as const }],
    }),
    [isSearching, page, searchQuery]
  );

  const { data, loading, error, refetch } = useQuery<DeletedCareersResult>(
    DELETED_CAREERS_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch,
      fetchPolicy: "network-only",
    }
  );

  const [restoreCareer] = useMutation(RESTORE_CAREER_MUTATION);

  const careers = useMemo(
    () => data?.deletedCareers?.careers ?? [],
    [data?.deletedCareers?.careers]
  );
  const total = data?.deletedCareers?.deletedCareerCount ?? 0;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const restore = async (career: Career) => {
    const result = await Swal.fire({
      title: "Restore this career?",
      html: `Designation: <strong>${career.title ?? "—"}</strong>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Restore",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await restoreCareer({ variables: { where: { id: career.id } } });
      await refetch();
      await Swal.fire({
        icon: "success",
        title: "Restored",
        text: "Career restored successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to restore career.";
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setPage(1);
  };

  return {
    careers,
    total,
    loading: !canFetch || loading,
    error,
    searchInput,
    setSearchInput,
    page,
    setPage,
    pageSize: CAREERS_PAGE_SIZE,
    isSearching,
    canFetch,
    restore,
    clearFilters,
  };
}
