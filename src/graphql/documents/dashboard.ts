import { gql } from "@apollo/client";

export const DASHBOARD_COUNTS_QUERY = gql`
  query DashboardCounts {
    usersCount
    vehiclsCount
    paymentsCount
    sellersCount
    locationsCount
  }
`;

export const DASHBOARD_ADMIN_EVENT_COUNT_QUERY = gql`
  query DashboardAdminEventCount {
    adminPanelEventCount
  }
`;

export const DASHBOARD_EVENTS_COUNT_QUERY = gql`
  query DashboardEventsCount {
    eventsCount
  }
`;

export const DASHBOARD_RECENT_EVENTS_QUERY = gql`
  query DashboardRecentEvents(
    $take: Int
    $skip: Int
    $orderBy: [EventOrderByInput!]
  ) {
    eventsData(take: $take, skip: $skip, orderBy: $orderBy) {
      events {
        id
        eventNo
        status
        createdAt
        seller {
          name
        }
        location {
          name
        }
      }
    }
  }
`;

export const DASHBOARD_RECENT_AUDIT_LOGS_QUERY = gql`
  query DashboardRecentAuditLogs(
    $take: Float
    $skip: Float
    $orderBy: [AuditLogOrderByInput!]
  ) {
    getAuditLogsList(take: $take, skip: $skip, orderBy: $orderBy) {
      auditLogs {
        id
        entityType
        entityId
        action
        changedByRole
        createdAt
      }
    }
  }
`;
