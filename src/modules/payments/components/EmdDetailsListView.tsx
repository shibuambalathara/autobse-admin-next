"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client";
import { User } from "lucide-react";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { EMD_TABLE_QUERY } from "@/graphql/documents/payments";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import { extractGraphqlError } from "@/lib/graphql-errors";
import type { EmdUpdateRow } from "@/modules/payments/types";
import type { TableColumn } from "@/types";

interface EmdDetailsListViewProps {
  paymentId: string;
}

export function EmdDetailsListView({ paymentId }: EmdDetailsListViewProps) {
  const { data, loading, error } = useQuery<{
    payment: {
      refNo?: number | null;
      emdUpdate?: EmdUpdateRow[];
    };
  }>(EMD_TABLE_QUERY, {
    variables: { where: { id: paymentId } },
  });

  const rows = data?.payment?.emdUpdate ?? [];

  const columns: TableColumn<EmdUpdateRow>[] = [
    { id: "emdNo", header: "Emd Number", accessor: "emdNo" },
    {
      id: "vehicleBuyingLimitIncrement",
      header: "Vehicle Buying Limit",
      accessor: "vehicleBuyingLimitIncrement",
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => (row.createdAt ? formatDate(row.createdAt) : "—"),
    },
    {
      id: "createdBy",
      header: "Created By",
      cell: (row) =>
        row.createdBy?.id ? (
          <Link
            href={ROUTES.userDetail(row.createdBy.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
            title={row.createdBy.firstName ?? "View user"}
          >
            <User className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
    },
  ];

  if (error) {
    return (
      <p className="text-destructive">{extractGraphqlError(error).message}</p>
    );
  }

  return (
    <PageContainer
      title="EMD Details"
      description={
        data?.payment?.refNo
          ? `Payment ref no ${data.payment.refNo}`
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
        <LoadingState label="Loading EMD details…" />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          variant="users"
          emptyTitle="No EMD updates"
          emptyDescription="Buying limit updates for this payment will appear here."
        />
      )}
    </PageContainer>
  );
}
