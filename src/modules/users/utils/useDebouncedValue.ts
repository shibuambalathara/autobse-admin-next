"use client";

import { useEffect, useState } from "react";

/** Matches legacy `DebounceSearchInput` default (800ms). */
export const USERS_SEARCH_DEBOUNCE_MS = 800;

export function useDebouncedValue<T>(value: T, delay = USERS_SEARCH_DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
