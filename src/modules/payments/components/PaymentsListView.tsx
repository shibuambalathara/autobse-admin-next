"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { PlusCircle } from "lucide-react";
import { Can } from "@/auth/can";
import { PERMISSIONS } from "@/auth/permissions";
import { PageContainer, buttonVariants } from "@/components/ui";
import { LoadingState } from "@/components/feedback";
import { PAYMENTS_LIST_QUERY } from "@/graphql/documents/payments";
import { ROUTES } from "@/constants/routes";
import {
  PAYMENTS_PAGE_SIZE,
  PAYMENT_FOR_FILTER_OPTIONS,
  PAYMENT_STATUS_FILTER_OPTIONS,
} from "@/modules/payments/constants";
import { PaymentsDataTable } from "@/modules/payments/components/PaymentsDataTable";
import type { PaymentsListResponse } from "@/modules/payments/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function PaymentsListView() {
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentForFilter, setPaymentForFilter] = useState("");

  const isSearching = Boolean(searchQuery);

  const where = useMemo(() => {
    const clause: Record<string, string> = {};
    if (statusFilter) clause.status = statusFilter;
    if (paymentForFilter) clause.paymentFor = paymentForFilter;
    return Object.keys(clause).length > 0 ? clause : undefined;
  }, [statusFilter, paymentForFilter]);

  const { data, loading, refetch } = useQuery<{
    payments: PaymentsListResponse;
  }>(PAYMENTS_LIST_QUERY, {
    variables: {
      where,
      search: searchQuery || undefined,
      orderBy: [{ createdAt: "DESC" }],
      take: isSearching ? undefined : PAYMENTS_PAGE_SIZE,
      skip: isSearching ? undefined : (page - 1) * PAYMENTS_PAGE_SIZE,
    },
    fetchPolicy: "network-only",
  });

  const payments = data?.payments?.payments ?? [];
  const total = data?.payments?.paymentsCount ?? 0;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, paymentForFilter]);

  const filters = [
    {
      id: "status",
      label: "Status",
      value: statusFilter,
      options: PAYMENT_STATUS_FILTER_OPTIONS,
    },
    {
      id: "paymentFor",
      label: "Payment For",
      value: paymentForFilter,
      options: PAYMENT_FOR_FILTER_OPTIONS,
    },
  ];

  const createPaymentAction = (
    <Can permission={PERMISSIONS.PAYMENTS_CREATE}>
      <Link
        href={ROUTES.paymentsCreate}
        className={buttonVariants({ size: "sm" })}
      >
        <PlusCircle className="h-4 w-4 shrink-0" />
        Create Payment
      </Link>
    </Can>
  );

  return (
    <PageContainer
      title="Payments"
      actions={createPaymentAction}
    >
      {loading && payments.length === 0 ? (
        <LoadingState label="Loading payments…" />
      ) : (
        <PaymentsDataTable
          payments={payments}
          isLoading={loading}
          onRefetch={() => void refetch()}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          filters={filters}
          onFilterChange={(id, value) => {
            if (id === "status") setStatusFilter(value);
            if (id === "paymentFor") setPaymentForFilter(value);
          }}
          pagination={
            isSearching
              ? undefined
              : { page, pageSize: PAYMENTS_PAGE_SIZE, total }
          }
          onPageChange={setPage}
        />
      )}
    </PageContainer>
  );
}
