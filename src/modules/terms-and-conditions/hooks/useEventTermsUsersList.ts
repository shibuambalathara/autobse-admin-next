"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { useAuthenticatedQuery } from "@/auth/use-authenticated-query";
import { TERMS_AND_CONDITIONS_LIST_QUERY } from "@/graphql/documents/terms-and-conditions";
import { TERMS_CONDITIONS_PAGE_SIZE } from "@/modules/terms-and-conditions/types";
import type { TermsConditionListResult } from "@/modules/terms-and-conditions/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useEventTermsUsersList(eventId: string) {
  const { canFetch } = useAuthenticatedQuery();
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const variables = useMemo(
    () => ({
      where: { eventId },
      orderBy: [{ createdAt: "DESC" as const }],
      take: TERMS_CONDITIONS_PAGE_SIZE,
      skip: searchQuery ? undefined : (page - 1) * TERMS_CONDITIONS_PAGE_SIZE,
      search: searchQuery || undefined,
    }),
    [eventId, page, searchQuery]
  );

  const { data, loading, error, refetch } = useQuery<TermsConditionListResult>(
    TERMS_AND_CONDITIONS_LIST_QUERY,
    {
      variables,
      fetchPolicy: "network-only",
      skip: !canFetch || !eventId,
    }
  );

  const terms = data?.getTermsAndConditions?.termsAndConditions ?? [];
  const total = data?.getTermsAndConditions?.termsAndConditionsCount ?? 0;

  const clearFilters = () => {
    setSearchInput("");
    setPage(1);
  };

  return {
    terms,
    total,
    loading,
    error,
    searchInput,
    setSearchInput,
    page,
    setPage,
    clearFilters,
    refetch,
    canFetch,
  };
}
