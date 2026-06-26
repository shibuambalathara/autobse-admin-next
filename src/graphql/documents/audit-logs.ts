import { gql } from "@apollo/client";

export const AUDIT_LOGS_LIST_QUERY = gql`
  query AuditLogsList(
    $where: AuditLogWhereInput
    $orderBy: [AuditLogOrderByInput!]
    $take: Float
    $skip: Float
    $search: String
  ) {
    getAuditLogsList(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
    ) {
      auditLogCount
      auditLogs {
        id
        entityId
        entityType
        action
        changedByRole
        changedByUserId
        changes
        createdAt
      }
    }
  }
`;

export const USER_AUDIT_LOGS_QUERY = gql`
  query UserAuditLogs(
    $userId: String!
    $search: String
    $orderBy: [AuditLogOrderByInput!]
    $skip: Float
    $take: Float
    $where: AuditLogWhereInput
  ) {
    userAuditLogs(
      userId: $userId
      search: $search
      orderBy: $orderBy
      skip: $skip
      take: $take
      where: $where
    ) {
      auditLogCount
      auditLogs {
        id
        changedByUserId
        changes
        action
        entityType
        entityId
        createdAt
        changedByRole
      }
    }
  }
`;
