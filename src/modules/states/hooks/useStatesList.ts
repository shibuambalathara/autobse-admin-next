"use client";

import { useQuery } from "@apollo/client";
import { STATES_QUERY } from "@/graphql/documents/states";
import type { StatesQueryResult } from "@/modules/states/types";

export function useStatesList() {
  const { data, loading, error, refetch } = useQuery<StatesQueryResult>(
    STATES_QUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const states = data?.States ?? [];

  return {
    states,
    loading,
    error,
    refetch,
  };
}
