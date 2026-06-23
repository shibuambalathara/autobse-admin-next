"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { PAYMENT_HISTORY_QUERY } from "@/graphql/documents/payments";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import { extractGraphqlError } from "@/lib/graphql-errors";
import type { PaymentStatusHistoryItem } from "@/modules/payments/types";
import type { TableColumn } from "@/types";

interface PaymentStatusHistoryViewProps {
  paymentId: string;
}

export function PaymentStatusHistoryView({ paymentId }: PaymentStatusHistoryViewProps) {
  const { data, loading, error } = useQuery<{
    payment: {
      refNo?: number | null;
      amount?: number | null;
      paymentFor?: string | null;
      statuspayment?: PaymentStatusHistoryItem[];
    };
  }>(PAYMENT_HISTORY_QUERY, {
    variables: { where: { id: paymentId } },
  });

  const history = data?.payment?.statuspayment ?? [];

  const columns: TableColumn<PaymentStatusHistoryItem & { id: string }>[] = [
    { id: "status", header: "Status", accessor: "status" },
    {
      id: "comment",
      header: "Comment",
      cell: (row) => row.comment || "—",
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => (row.createdAt ? formatDate(row.createdAt) : "—"),
    },
    {
      id: "createdBy",
      header: "Created By",
      cell: (row) => row.createdBy?.firstName ?? "—",
    },
  ];

  if (error) {
    return (
      <p className="text-destructive">{extractGraphqlError(error).message}</p>
    );
  }

  const tableData = history
    .filter((item): item is PaymentStatusHistoryItem & { id: string } => Boolean(item.id))
    .map((item) => ({ ...item, id: item.id! }));

  return (
    <PageContainer
      title="Payment Status History"
      description={
        data?.payment?.refNo
          ? `Ref ${data.payment.refNo} · ${data.payment.paymentFor ?? ""} · ₹${data.payment.amount ?? ""}`
          : undefined
      }
      actions={
        <Link
          href={ROUTES.payments}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          Back to Payments
        </Link>
      }
    >
      {loading ? (
        <LoadingState label="Loading payment history…" />
      ) : (
        <DataTable
          columns={columns}
          data={tableData}
          variant="users"
          emptyTitle="No status history"
          emptyDescription="Status changes for this payment will appear here."
        />
      )}
    </PageContainer>
  );
}
