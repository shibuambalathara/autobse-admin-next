"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useAuth } from "@/auth/use-auth";
import { PERMISSIONS } from "@/auth/permissions";
import { APP_ROLES, isRole } from "@/auth/roles";
import { useAccess } from "@/auth/use-access";
import {
  DASHBOARD_ADMIN_EVENT_COUNT_QUERY,
  DASHBOARD_COUNTS_QUERY,
  DASHBOARD_EVENTS_COUNT_QUERY,
  DASHBOARD_RECENT_AUDIT_LOGS_QUERY,
  DASHBOARD_RECENT_EVENTS_QUERY,
} from "@/graphql/documents/dashboard";
import {
  DASHBOARD_RECENT_LIMIT,
  DASHBOARD_STAT_CONFIG,
} from "@/modules/dashboard/constants/dashboard-config";
import type { DashboardStat } from "@/modules/dashboard/types";
import {
  formatDashboardCount,
  mapAuditLogToActivityItem,
  mapEventToOverviewRow,
} from "@/modules/dashboard/utils/dashboard-mappers";
import type { AuditLogsListResult } from "@/modules/audit-logs/types";
import type { NewEventsListingResult } from "@/modules/events/types";

interface DashboardCountsResult {
  usersCount: number;
  vehiclsCount: number;
  paymentsCount: number;
  sellersCount: number;
  locationsCount: number;
}

interface DashboardAdminEventCountResult {
  adminPanelEventCount: number;
}

interface DashboardEventsCountResult {
  eventsCount: number;
}

export function useDashboardData() {
  const { isAuthenticated, isInitializing, isRefreshing, accessToken } =
    useAuth();
  const { can, role } = useAccess();

  const canFetch =
    isAuthenticated &&
    !isInitializing &&
    !isRefreshing &&
    Boolean(accessToken);

  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const canViewEvents = can(PERMISSIONS.EVENTS_READ);
  const canViewUsers = can(PERMISSIONS.USERS_READ);
  const canViewVehicles = can(PERMISSIONS.VEHICLES_READ);
  const canViewPayments = can(PERMISSIONS.PAYMENTS_READ);
  const canUseAdminEventCount =
    isRole(role, APP_ROLES.ADMIN) ||
    isRole(role, APP_ROLES.STAFF) ||
    isRole(role, APP_ROLES.ACCOUNTANT);

  const countsQuery = useQuery<DashboardCountsResult>(DASHBOARD_COUNTS_QUERY, {
    skip: !canFetch,
    fetchPolicy: "network-only",
  });

  const adminEventCountQuery = useQuery<DashboardAdminEventCountResult>(
    DASHBOARD_ADMIN_EVENT_COUNT_QUERY,
    {
      skip: !canFetch || !canViewEvents || !canUseAdminEventCount,
      fetchPolicy: "network-only",
    }
  );

  const eventsCountQuery = useQuery<DashboardEventsCountResult>(
    DASHBOARD_EVENTS_COUNT_QUERY,
    {
      skip: !canFetch || !canViewEvents || canUseAdminEventCount,
      fetchPolicy: "network-only",
    }
  );

  const recentEventsQuery = useQuery<NewEventsListingResult>(
    DASHBOARD_RECENT_EVENTS_QUERY,
    {
      variables: {
        take: DASHBOARD_RECENT_LIMIT,
        skip: 0,
        orderBy: [{ createdAt: "DESC" }],
      },
      skip: !canFetch || !canViewEvents,
      fetchPolicy: "network-only",
    }
  );

  const recentAuditLogsQuery = useQuery<AuditLogsListResult>(
    DASHBOARD_RECENT_AUDIT_LOGS_QUERY,
    {
      variables: {
        take: DASHBOARD_RECENT_LIMIT,
        skip: 0,
        orderBy: [{ createdAt: "DESC" }],
      },
      skip: !canFetch || !isAdmin,
      fetchPolicy: "network-only",
    }
  );

  const eventCount =
    adminEventCountQuery.data?.adminPanelEventCount ??
    eventsCountQuery.data?.eventsCount ??
    null;

  const stats = useMemo((): DashboardStat[] => {
    const counts = countsQuery.data;
    const countById: Record<string, number | null> = {
      users: canViewUsers ? (counts?.usersCount ?? null) : null,
      events: canViewEvents ? eventCount : null,
      vehicles: canViewVehicles ? (counts?.vehiclsCount ?? null) : null,
      payments: canViewPayments ? (counts?.paymentsCount ?? null) : null,
    };

    return DASHBOARD_STAT_CONFIG.filter((slot) => countById[slot.id] != null).map(
      (slot) => ({
        id: slot.id,
        label: slot.label,
        value: formatDashboardCount(countById[slot.id]),
        icon: slot.icon,
        href: slot.href,
      })
    );
  }, [
    canViewEvents,
    canViewPayments,
    canViewUsers,
    canViewVehicles,
    countsQuery.data,
    eventCount,
  ]);

  const overviewRows = useMemo(
    () =>
      (recentEventsQuery.data?.eventsData?.events ?? []).map(mapEventToOverviewRow),
    [recentEventsQuery.data?.eventsData?.events]
  );

  const activityItems = useMemo(
    () =>
      (recentAuditLogsQuery.data?.getAuditLogsList?.auditLogs ?? []).map(
        mapAuditLogToActivityItem
      ),
    [recentAuditLogsQuery.data?.getAuditLogsList?.auditLogs]
  );

  const statsLoading =
    !canFetch ||
    countsQuery.loading ||
    (canViewEvents &&
      (canUseAdminEventCount
        ? adminEventCountQuery.loading
        : eventsCountQuery.loading));

  const overviewLoading = !canFetch || recentEventsQuery.loading;
  const activityLoading = !canFetch || (isAdmin && recentAuditLogsQuery.loading);

  const statsError = countsQuery.error ?? adminEventCountQuery.error ?? eventsCountQuery.error;
  const overviewError = recentEventsQuery.error;
  const activityError = recentAuditLogsQuery.error;

  return {
    canFetch,
    isAdmin,
    canViewEvents,
    stats,
    statsLoading,
    statsError,
    overviewRows,
    overviewLoading,
    overviewError,
    activityItems,
    activityLoading,
    activityError,
  };
}
