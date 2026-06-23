"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { PlusCircle } from "lucide-react";
import { Can } from "@/auth/can";
import { PERMISSIONS } from "@/auth/permissions";
import { PageContainer, buttonVariants } from "@/components/ui";
import { LoadingState } from "@/components/feedback";
import { USER_PAYMENTS_QUERY } from "@/graphql/documents/payments";
import { ROUTES } from "@/constants/routes";
import {
  PAYMENTS_PAGE_SIZE,
  PAYMENT_FOR_FILTER_OPTIONS,
  PAYMENT_STATUS_FILTER_OPTIONS,
} from "@/modules/payments/constants";
import { PaymentsDataTable } from "@/modules/payments/components/PaymentsDataTable";
import type { PaymentsListResponse } from "@/modules/payments/types";

interface UserPaymentsListViewProps {
  userId: string;
}

export function UserPaymentsListView({ userId }: UserPaymentsListViewProps) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentForFilter, setPaymentForFilter] = useState("");

  const where = useMemo(() => {
    const clause: Record<string, string> = { userId };
    if (statusFilter) clause.status = statusFilter;
    if (paymentForFilter) clause.paymentFor = paymentForFilter;
    return clause;
  }, [userId, statusFilter, paymentForFilter]);

  const { data, loading, refetch } = useQuery<{
    payments: PaymentsListResponse;
  }>(USER_PAYMENTS_QUERY, {
    variables: {
      where,
      orderBy: [{ createdAt: "DESC" }],
      take: PAYMENTS_PAGE_SIZE,
      skip: (page - 1) * PAYMENTS_PAGE_SIZE,
    },
    fetchPolicy: "network-only",
  });

  const payments = data?.payments?.payments ?? [];
  const total = data?.payments?.paymentsCount ?? 0;
  const user = payments[0]?.user;
  const title = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}${user.firstName || user.lastName ? "'s" : ""} Payment Records`.trim()
    : "Payment Records";

  useEffect(() => {
    setPage(1);
  }, [statusFilter, paymentForFilter]);

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

  return (
    <PageContainer
      title={title}
      actions={
        <>
          <Link
            href={ROUTES.userDetail(userId)}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Back to User
          </Link>
          <Can permission={PERMISSIONS.PAYMENTS_CREATE}>
            <Link
              href={ROUTES.createPayment(userId)}
              className={buttonVariants({ size: "sm" })}
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              Create Payment
            </Link>
          </Can>
        </>
      }
    >
      {loading && payments.length === 0 ? (
        <LoadingState label="Loading payments…" />
      ) : (
        <PaymentsDataTable
          payments={payments}
          isLoading={loading}
          onRefetch={() => void refetch()}
          filters={filters}
          onFilterChange={(id, value) => {
            if (id === "status") setStatusFilter(value);
            if (id === "paymentFor") setPaymentForFilter(value);
          }}
          pagination={{ page, pageSize: PAYMENTS_PAGE_SIZE, total }}
          onPageChange={setPage}
        />
      )}
    </PageContainer>
  );
}
