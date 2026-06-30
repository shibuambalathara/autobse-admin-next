"use client";

import { useQuery } from "@apollo/client";
import { useAccess } from "@/auth/use-access";
import { PERMISSIONS } from "@/auth/permissions";
import { useAuthenticatedQuery } from "@/auth/use-authenticated-query";
import {
  EVENT_BY_ID_QUERY,
  SINGLE_EVENT_QUERY,
} from "@/graphql/documents/events";
import type {
  EventByIdResult,
  EventDetail,
  SingleEventResult,
} from "@/modules/events/types";

interface UseEventDetailResult {
  event: EventDetail | null | undefined;
  loading: boolean;
  error: ReturnType<typeof useQuery>["error"];
}

/**
 * Staff/admin use `event` (signed file URLs). Read-only roles use `eventsData`
 * so accountants are not blocked when the single-event resolver lags behind.
 */
export function useEventDetail(eventId: string): UseEventDetailResult {
  const { can } = useAccess();
  const { canFetch } = useAuthenticatedQuery();
  const canManageEvents = can(PERMISSIONS.EVENTS_MANAGE);
  const skip = !eventId || !canFetch;

  const singleQuery = useQuery<SingleEventResult>(SINGLE_EVENT_QUERY, {
    variables: { where: { id: eventId } },
    skip: skip || !canManageEvents,
  });

  const listQuery = useQuery<EventByIdResult>(EVENT_BY_ID_QUERY, {
    variables: { where: { id: eventId }, take: 1 },
    skip: skip || canManageEvents,
  });

  if (canManageEvents) {
    return {
      event: singleQuery.data?.event,
      loading: singleQuery.loading,
      error: singleQuery.error,
    };
  }

  return {
    event: listQuery.data?.eventsData?.events?.[0],
    loading: listQuery.loading,
    error: listQuery.error,
  };
}
