"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { STATES_QUERY } from "@/graphql/documents/users";
import type { StatesQueryResult } from "@/modules/locations/types";
import { formatStateDisplay } from "@/modules/users/utils";

export function useLocationStateOptions() {
  const { data, loading } = useQuery<StatesQueryResult>(STATES_QUERY, {
    fetchPolicy: "cache-first",
  });

  const stateOptions = useMemo(
    () =>
      (data?.States ?? []).map((state) => ({
        value: state.id,
        label: formatStateDisplay(state.name),
      })),
    [data?.States]
  );

  const stateNameById = useMemo(() => {
    const map: Record<string, string> = {};
    (data?.States ?? []).forEach((state) => {
      map[state.id] = formatStateDisplay(state.name);
    });
    return map;
  }, [data?.States]);

  return {
    stateOptions,
    stateNameById,
    loading,
  };
}
