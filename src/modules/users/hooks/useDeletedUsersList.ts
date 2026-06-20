"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  DELETED_USERS_QUERY,
  RESTORE_USER_MUTATION,
} from "@/graphql/documents/users";
import { USERS_PAGE_SIZE } from "@/modules/users/constants";
import type { DeletedUsersQueryResult, UserWhereInput } from "@/modules/users/types";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";
import Swal from "sweetalert2";

export function useDeletedUsersList() {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput);
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);

  const queryVariables = useMemo(() => {
    const where: UserWhereInput = {};
    if (state) where.state = [state];

    return {
      where: Object.keys(where).length > 0 ? where : undefined,
      search: searchQuery || undefined,
      skip: searchQuery ? undefined : (page - 1) * USERS_PAGE_SIZE,
      take: searchQuery ? undefined : USERS_PAGE_SIZE,
      orderBy: { updatedAt: "DESC" as const },
    };
  }, [page, searchQuery, state]);

  const { data, loading, refetch } = useQuery<DeletedUsersQueryResult>(
    DELETED_USERS_QUERY,
    { variables: queryVariables, fetchPolicy: "network-only" }
  );

  const [restoreUser] = useMutation(RESTORE_USER_MUTATION);

  const users = data?.deletedUsers?.users ?? [];
  const total = data?.deletedUsers?.deletedUserCount ?? 0;

  const restore = async (
    id: string,
    user: { firstName?: string | null; lastName?: string | null; role?: string | null }
  ) => {
    const response = await Swal.fire({
      title: "Are you sure you want to restore this user?",
      html: `
        User Name: ${user?.firstName} ${user?.lastName || ""}<br>
        Role: ${user?.role}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Restore User",
      cancelButtonText: "Cancel",
    });

    if (!response.isConfirmed) return;

    try {
      await restoreUser({ variables: { where: { id } } });
      await Swal.fire({
        icon: "success",
        title: "Restored",
        text: "User restored successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      await refetch();
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setState("");
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, state]);

  return {
    users,
    total,
    loading,
    refetch,
    restore,
    searchInput,
    setSearchInput,
    state,
    setState,
    page,
    setPage,
    pageSize: USERS_PAGE_SIZE,
    clearFilters,
  };
}
