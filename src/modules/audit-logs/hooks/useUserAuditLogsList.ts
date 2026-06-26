"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { USER_AUDIT_LOGS_QUERY } from "@/graphql/documents/audit-logs";
import { AUDIT_LOGS_PAGE_SIZE } from "@/modules/audit-logs/constants";
import { useAuthenticatedAdminQuery } from "@/modules/audit-logs/hooks/useAuthenticatedAdminQuery";
import type {
  AuditChangedByRole,
  AuditEntityType,
  UserAuditLogsQueryVariables,
  UserAuditLogsResult,
} from "@/modules/audit-logs/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

interface UseUserAuditLogsListOptions {
  userId: string;
}

export function useUserAuditLogsList({ userId }: UseUserAuditLogsListOptions) {
  const { canFetch } = useAuthenticatedAdminQuery();
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [entityType, setEntityType] = useState<AuditEntityType | "">("");
  const [changedByRole, setChangedByRole] = useState<AuditChangedByRole | "">("");
  const [page, setPage] = useState(1);

  const queryVariables = useMemo((): UserAuditLogsQueryVariables => {
    const where: UserAuditLogsQueryVariables["where"] = {};
    if (entityType) where.entityType = entityType;
    if (changedByRole) where.changedByRole = changedByRole;

    return {
      userId,
      search: searchQuery || undefined,
      skip: (page - 1) * AUDIT_LOGS_PAGE_SIZE,
      take: AUDIT_LOGS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" }],
      where: Object.keys(where).length > 0 ? where : undefined,
    };
  }, [changedByRole, entityType, page, searchQuery, userId]);

  const { data, loading, error, refetch } = useQuery<UserAuditLogsResult>(
    USER_AUDIT_LOGS_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch || !userId,
      fetchPolicy: "network-only",
    }
  );

  const auditLogs = useMemo(
    () => data?.userAuditLogs?.auditLogs ?? [],
    [data?.userAuditLogs?.auditLogs]
  );
  const total = data?.userAuditLogs?.auditLogCount ?? 0;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, entityType, changedByRole, userId]);

  const clearFilters = () => {
    setSearchInput("");
    setEntityType("");
    setChangedByRole("");
    setPage(1);
  };

  return {
    auditLogs,
    total,
    loading: !canFetch || loading,
    error,
    refetch,
    searchInput,
    setSearchInput,
    entityType,
    setEntityType,
    changedByRole,
    setChangedByRole,
    page,
    setPage,
    pageSize: AUDIT_LOGS_PAGE_SIZE,
    canFetch,
    clearFilters,
  };
}
