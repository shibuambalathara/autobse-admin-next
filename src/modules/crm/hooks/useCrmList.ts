"use client";

import { useCallback, useMemo, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  CRM_LIST_QUERY,
  POTENTIAL_CLIENT_BASIC_INFO_QUERY,
} from "@/graphql/documents/crm";
import { CRM_PAGE_SIZE } from "@/modules/crm/constants";
import {
  useCrmFilterOptions,
  useResetCrmPageOnFilterChange,
} from "@/modules/crm/hooks/useCrmFilterOptions";
import type {
  CrmListResult,
  CrmListVariables,
  CrmPageFilters,
  PotentialClientBasicInfoResult,
  PotentialClientsWhereInput,
} from "@/modules/crm/types";
import { exportRowsToExcel } from "@/lib/excel-export";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { formatStateDisplay } from "@/modules/users/utils";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";
import Swal from "sweetalert2";

const emptyFilters: CrmPageFilters = {
  stateId: undefined,
  locationId: undefined,
  status: undefined,
  buyerPreference: undefined,
  assignedStaffId: undefined,
  vehicleCategoryId: undefined,
  nextFollowUpAt: undefined,
};

function buildWhereFromFilters(
  filters: CrmPageFilters
): PotentialClientsWhereInput | undefined {
  const { nextFollowUpAt, ...flatFilters } = filters;
  const activeFilters: PotentialClientsWhereInput = {};

  if (flatFilters.stateId) activeFilters.stateId = flatFilters.stateId;
  if (flatFilters.locationId) activeFilters.locationId = flatFilters.locationId;
  if (flatFilters.status) activeFilters.status = flatFilters.status;
  if (flatFilters.buyerPreference) {
    activeFilters.buyerPreference = flatFilters.buyerPreference;
  }
  if (flatFilters.assignedStaffId) {
    activeFilters.assignedStaffId = flatFilters.assignedStaffId;
  }
  if (flatFilters.vehicleCategoryId) {
    activeFilters.vehicleCategoryId = flatFilters.vehicleCategoryId;
  }
  if (nextFollowUpAt) {
    activeFilters.callLogs = { some: { nextFollowUpAt } };
  }

  return Object.keys(activeFilters).length > 0 ? activeFilters : undefined;
}

export function useCrmList() {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [filters, setFilters] = useState<CrmPageFilters>(emptyFilters);
  const [page, setPage] = useState(1);

  useResetCrmPageOnFilterChange(
    [
      searchQuery,
      filters.stateId,
      filters.locationId,
      filters.status,
      filters.buyerPreference,
      filters.assignedStaffId,
      filters.vehicleCategoryId,
      filters.nextFollowUpAt,
    ],
    setPage
  );

  const filterOptions = useCrmFilterOptions(filters.stateId ?? "");

  const where = useMemo(
    () => buildWhereFromFilters(filters),
    [filters]
  );

  const queryVariables = useMemo((): CrmListVariables => {
    const skip = searchQuery ? undefined : (page - 1) * CRM_PAGE_SIZE;
    const take = searchQuery ? undefined : CRM_PAGE_SIZE;
    return {
      where,
      search: searchQuery || undefined,
      skip,
      take,
      orderBy: [{ createdAt: "DESC" }],
    };
  }, [where, searchQuery, page]);

  const { data, loading, refetch } = useQuery<CrmListResult>(CRM_LIST_QUERY, {
    variables: queryVariables,
    fetchPolicy: "network-only",
  });

  const [fetchBasicInfo, { loading: excelLoading }] =
    useLazyQuery<PotentialClientBasicInfoResult>(
      POTENTIAL_CLIENT_BASIC_INFO_QUERY,
      { fetchPolicy: "network-only" }
    );

  const clients = data?.potentialClients?.potentialClients ?? [];
  const total = data?.potentialClients?.clientCount ?? 0;

  const setFilter = useCallback(
    (name: keyof CrmPageFilters, value: string) => {
      setFilters((prev) => {
        const next = { ...prev, [name]: value || undefined };
        if (name === "stateId") next.locationId = undefined;
        return next;
      });
    },
    []
  );

  const clearFilters = () => {
    setSearchInput("");
    setFilters(emptyFilters);
    setPage(1);
  };

  const downloadExcel = async (
    stateId: string,
    skip: number,
    take: number
  ): Promise<boolean> => {
    if (!stateId) {
      await Swal.fire({
        icon: "warning",
        title: "State required",
        text: "Please select a state to download CRM Excel.",
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

    const excelWhere: PotentialClientsWhereInput = { stateId };
    if (filters.locationId) excelWhere.locationId = filters.locationId;
    if (filters.status) excelWhere.status = filters.status;
    if (filters.buyerPreference) excelWhere.buyerPreference = filters.buyerPreference;
    if (filters.assignedStaffId) excelWhere.assignedStaffId = filters.assignedStaffId;
    if (filters.vehicleCategoryId) {
      excelWhere.vehicleCategoryId = filters.vehicleCategoryId;
    }
    if (filters.nextFollowUpAt) {
      excelWhere.callLogs = { some: { nextFollowUpAt: filters.nextFollowUpAt } };
    }

    try {
      const { data: excelData } = await fetchBasicInfo({
        variables: { where: excelWhere, skip, take },
      });
      const rows =
        excelData?.potentialClientBasicInfo?.potentialClientBasicInfo ?? [];

      if (rows.length === 0) {
        await Swal.fire({
          icon: "info",
          title: "No Data",
          text: "No clients found for the selected skip, take, and filters.",
        });
        return false;
      }

      exportRowsToExcel(
        rows.map((client) => ({
          idNo: client.idNo,
          firstName: client.firstName,
          lastName: client.lastName,
          mobile: client.mobile,
          state: client.state?.name
            ? formatStateDisplay(client.state.name)
            : "—",
        })),
        `crm_clients_${formatStateDisplay(filterOptions.stateNameById[stateId] ?? "state").replace(/\s+/g, "_")}.xlsx`
      );

      await Swal.fire({
        icon: "success",
        title: "Downloaded",
        text: `${rows.length} client(s) exported.`,
        timer: 2500,
        showConfirmButton: false,
      });
      return true;
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Download Failed", text: message });
      return false;
    }
  };

  return {
    searchInput,
    setSearchInput,
    filters,
    setFilter,
    page,
    setPage,
    pageSize: CRM_PAGE_SIZE,
    clients,
    total,
    loading,
    refetch,
    clearFilters,
    filterOptions,
    downloadExcel,
    excelLoading,
  };
}
