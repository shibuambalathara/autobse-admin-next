"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  DELETE_USERS_BY_DATE_RANGE_MUTATION,
  FILTERED_USERS_COUNT_QUERY,
  USERS_QUERY,
} from "@/graphql/documents/users";
import { EMD_APPROVED_USERS_LIST_QUERY } from "@/graphql/documents/users";
import { USERS_PAGE_SIZE } from "@/modules/users/constants";
import { buildEmdExcelWhere } from "@/modules/users/utils";
import type {
  EmdAmountOperator,
  EmdApprovedUser,
  UserRoleType,
  UsersQueryResult,
  UsersQueryVariables,
  UserStatusType,
  UserWhereInput,
} from "@/modules/users/types";
import { formatDateOnly, monthInputToIsoStart } from "@/lib/date-format";
import { exportRowsToExcel } from "@/lib/excel-export";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";
import Swal from "sweetalert2";

export function useUsersList() {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput);
  const [state, setState] = useState<string>("");
  const [role, setRole] = useState<UserRoleType | "">("");
  const [status, setStatus] = useState<UserStatusType | "">("");
  const [registrationExpiryDate, setRegistrationExpiryDate] = useState("");
  const [page, setPage] = useState(1);

  const usersFilterWhere = useMemo((): UserWhereInput | undefined => {
    const where: UserWhereInput = {};
    if (state) where.state = [state];
    if (role) where.role = role;
    if (status) where.status = status;
    if (registrationExpiryDate) {
      const expiryFilter = monthInputToIsoStart(registrationExpiryDate);
      if (expiryFilter) where.registrationExpiryDate = expiryFilter;
    }
    return Object.keys(where).length > 0 ? where : undefined;
  }, [state, role, status, registrationExpiryDate]);

  const queryVariables = useMemo((): UsersQueryVariables => {
    const skip = searchQuery ? undefined : (page - 1) * USERS_PAGE_SIZE;
    const take = searchQuery ? undefined : USERS_PAGE_SIZE;
    return {
      where: usersFilterWhere,
      search: searchQuery || undefined,
      skip,
      take,
      orderBy: [{ createdAt: "DESC" }],
    };
  }, [page, searchQuery, usersFilterWhere]);

  const { data, loading, refetch } = useQuery<UsersQueryResult>(USERS_QUERY, {
    variables: queryVariables,
    fetchPolicy: "network-only",
  });

  const users = data?.users?.users ?? [];
  const total = data?.users?.usersCount ?? 0;

  const [fetchFilteredCount] = useLazyQuery(FILTERED_USERS_COUNT_QUERY, {
    fetchPolicy: "network-only",
  });
  const [fetchUsersForExcel, { loading: excelLoading }] = useLazyQuery(
    USERS_QUERY,
    { fetchPolicy: "network-only" }
  );
  const [fetchEmdUsers, { loading: emdExcelLoading }] = useLazyQuery(
    EMD_APPROVED_USERS_LIST_QUERY,
    { fetchPolicy: "network-only" }
  );
  const [deleteUsersByDateRange, { loading: deletingByDate }] = useMutation(
    DELETE_USERS_BY_DATE_RANGE_MUTATION
  );

  const clearFilters = () => {
    setState("");
    setRole("");
    setStatus("");
    setRegistrationExpiryDate("");
    setPage(1);
  };

  const formatUsersForExcel = (
    list: UsersQueryResult["users"]["users"]
  ) =>
    list.map((user) => ({
      "First Name": user.firstName ?? "",
      "Last Name": user.lastName ?? "",
      Mobile: user.mobile ?? "",
      Status: user.status ?? "",
      State: user.state?.replace(/_/g, " ") ?? "",
      "Registration Expiry": user.registrationExpiryDate
        ? formatDateOnly(user.registrationExpiryDate)
        : "",
    }));

  const formatEmdUsersForExcel = (list: EmdApprovedUser[]) =>
    list.map((user) => ({
      "First Name": user.firstName ?? "",
      "Last Name": user.lastName ?? "",
      Mobile: user.mobile ?? "",
      State: user.state?.replace(/_/g, " ") ?? "",
      Status: user.status ?? "",
      "Created At": user.createdAt ? formatDateOnly(user.createdAt) : "",
    }));

  const downloadUsersExcel = useCallback(
    async (skip: number, take: number) => {
      if (Number.isNaN(take) || take <= 0) {
        await Swal.fire({
          icon: "warning",
          title: "Invalid Take",
          text: "Please enter a valid take value greater than 0.",
        });
        return false;
      }
      if (Number.isNaN(skip) || skip < 0) {
        await Swal.fire({
          icon: "warning",
          title: "Invalid Skip",
          text: "Please enter a valid skip value (0 or greater).",
        });
        return false;
      }

      try {
        const { data: excelData, error } = await fetchUsersForExcel({
          variables: {
            where: usersFilterWhere,
            search: searchQuery || undefined,
            skip,
            take,
            orderBy: [{ createdAt: "DESC" }],
          },
          errorPolicy: "none",
        });

        if (error) throw error;

        const rows = excelData?.users?.users ?? [];
        if (rows.length === 0) {
          await Swal.fire({
            icon: "info",
            title: "No Data",
            text: "No users found for the current filters, skip, and take.",
          });
          return false;
        }

        exportRowsToExcel(formatUsersForExcel(rows), "users.xlsx");
        await Swal.fire({
          icon: "success",
          title: "Downloaded",
          text: `${rows.length} user(s) exported.`,
          timer: 2500,
          showConfirmButton: false,
        });
        return true;
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Download Failed", text: message });
        return false;
      }
    },
    [fetchUsersForExcel, searchQuery, usersFilterWhere]
  );

  const getFilteredCount = useCallback(async () => {
    const { data: countData, error } = await fetchFilteredCount({
      variables: {
        where: usersFilterWhere,
        search: searchQuery || undefined,
      },
      errorPolicy: "none",
    });
    if (error) throw error;
    return countData?.users?.usersCount ?? 0;
  }, [fetchFilteredCount, searchQuery, usersFilterWhere]);

  const downloadEmdExcel = useCallback(
    async (params: {
      skip: number;
      take: number;
      operator: EmdAmountOperator;
      amount: number;
      state: string;
      paymentFor: string;
      paymentStatus: string;
    }) => {
      const { skip, take, operator, amount, state, paymentFor, paymentStatus } =
        params;

      if (Number.isNaN(amount) || amount < 0) {
        await Swal.fire({
          icon: "warning",
          title: "Invalid Amount",
          text: "Please enter a valid EMD amount (0 or greater).",
        });
        return false;
      }
      if (Number.isNaN(take) || take <= 0) {
        await Swal.fire({
          icon: "warning",
          title: "Invalid Take",
          text: "Please enter a valid take value greater than 0.",
        });
        return false;
      }
      if (Number.isNaN(skip) || skip < 0) {
        await Swal.fire({
          icon: "warning",
          title: "Invalid Skip",
          text: "Please enter a valid skip value (0 or greater).",
        });
        return false;
      }

      try {
        const where = buildEmdExcelWhere(
          operator,
          amount,
          state,
          paymentFor,
          paymentStatus
        );
        const { data: emdData, error } = await fetchEmdUsers({
          variables: { where, skip, take },
          errorPolicy: "none",
        });

        if (error) throw error;

        const rows = emdData?.emdApprovedUsers?.users ?? [];
        if (rows.length === 0) {
          await Swal.fire({
            icon: "info",
            title: "No Data",
            text: "No EMD approved users found for the selected filters, skip, and take.",
          });
          return false;
        }

        exportRowsToExcel(
          formatEmdUsersForExcel(rows),
          "emd_approved_users.xlsx"
        );
        await Swal.fire({
          icon: "success",
          title: "Downloaded",
          text: `${rows.length} EMD approved user(s) exported.`,
          timer: 2500,
          showConfirmButton: false,
        });
        return true;
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Download Failed", text: message });
        return false;
      }
    },
    [fetchEmdUsers]
  );

  const getEmdApprovedCount = useCallback(
    async (params: {
      operator: EmdAmountOperator;
      amount: number;
      state: string;
      paymentFor: string;
      paymentStatus: string;
    }) => {
      const where = buildEmdExcelWhere(
        params.operator,
        params.amount,
        params.state,
        params.paymentFor,
        params.paymentStatus
      );
      const { data: emdData, error } = await fetchEmdUsers({
        variables: { where, skip: 0, take: 1 },
        errorPolicy: "none",
      });
      if (error) throw error;
      return emdData?.emdApprovedUsers?.usersCount ?? 0;
    },
    [fetchEmdUsers]
  );

  const deleteByDateRange = async (startDate: string, endDate: string) => {
    if (!startDate || !endDate) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Dates",
        text: "Please select both start and end date",
      });
      return false;
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      html: `
        <p>This will <b>permanently delete</b> all users created between:</p>
        <p><b>${startDate}</b> and <b>${endDate}</b></p>
      `,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return false;

    try {
      await deleteUsersByDateRange({
        variables: {
          where: {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          },
        },
      });
      await Swal.fire({
        icon: "success",
        title: "Users Deleted",
        text: "Users were successfully deleted for the selected date range.",
      });
      await refetch();
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete users";
      await Swal.fire({ icon: "error", title: "Failed", text: message });
      return false;
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, state, role, status, registrationExpiryDate]);

  return {
    users,
    total,
    loading,
    refetch,
    searchInput,
    setSearchInput,
    state,
    setState,
    role,
    setRole,
    status,
    setStatus,
    registrationExpiryDate,
    setRegistrationExpiryDate,
    page,
    setPage,
    pageSize: USERS_PAGE_SIZE,
    clearFilters,
    downloadUsersExcel,
    downloadEmdExcel,
    getFilteredCount,
    getEmdApprovedCount,
    deleteByDateRange,
    excelLoading,
    emdExcelLoading,
    deletingByDate,
    usersFilterWhere,
    searchQuery,
  };
}
