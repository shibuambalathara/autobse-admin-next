"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { AUDIT_LOGS_LIST_QUERY } from "@/graphql/documents/audit-logs";
import { AUDIT_LOGS_PAGE_SIZE } from "@/modules/audit-logs/constants";
import { useAuthenticatedAdminQuery } from "@/modules/audit-logs/hooks/useAuthenticatedAdminQuery";
import type {
  AuditChangedByRole,
  AuditEntityType,
  AuditLogsListResult,
  AuditLogsQueryVariables,
} from "@/modules/audit-logs/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useAuditLogsList() {
  const { canFetch } = useAuthenticatedAdminQuery();
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [entityType, setEntityType] = useState<AuditEntityType | "">("");
  const [changedByRole, setChangedByRole] = useState<AuditChangedByRole | "">("");
  const [page, setPage] = useState(1);
  const isSearching = Boolean(searchQuery);
  const hasFilters = Boolean(entityType || changedByRole);

  const queryVariables = useMemo((): AuditLogsQueryVariables => {
    const where: AuditLogsQueryVariables["where"] = {};
    if (entityType) where.entityType = entityType;
    if (changedByRole) where.changedByRole = changedByRole;

    const disablePagination = isSearching || hasFilters;

    return {
      where: Object.keys(where).length > 0 ? where : undefined,
      search: searchQuery || undefined,
      skip: disablePagination ? undefined : (page - 1) * AUDIT_LOGS_PAGE_SIZE,
      take: disablePagination ? undefined : AUDIT_LOGS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" }],
    };
  }, [changedByRole, entityType, hasFilters, isSearching, page, searchQuery]);

  const { data, loading, error, refetch } = useQuery<AuditLogsListResult>(
    AUDIT_LOGS_LIST_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch,
      fetchPolicy: "network-only",
    }
  );

  const auditLogs = useMemo(
    () => data?.getAuditLogsList?.auditLogs ?? [],
    [data?.getAuditLogsList?.auditLogs]
  );
  const total = data?.getAuditLogsList?.auditLogCount ?? auditLogs.length;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, entityType, changedByRole]);

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
    isSearching,
    hasFilters,
    canFetch,
    clearFilters,
  };
}
