"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { ArrowLeft, User } from "lucide-react";
import { Can } from "@/auth/can";
import { PERMISSIONS } from "@/auth/permissions";
import { useAuthenticatedQuery } from "@/auth/use-authenticated-query";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { USER_BUYING_LIMIT_QUERY } from "@/graphql/documents/payments";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import { extractGraphqlError } from "@/lib/graphql-errors";
import type { EmdUpdateRow } from "@/modules/payments/types";
import type { TableColumn } from "@/types";

interface VehicleBuyingLimitListViewProps {
  userId: string;
}

export function VehicleBuyingLimitListView({
  userId,
}: VehicleBuyingLimitListViewProps) {
  const { canFetch } = useAuthenticatedQuery();

  const { data, loading, error } = useQuery<{
    user: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      emdUpdates?: EmdUpdateRow[];
    } | null;
  }>(USER_BUYING_LIMIT_QUERY, {
    variables: { where: { id: userId } },
    fetchPolicy: "network-only",
    skip: !canFetch,
  });

  const user = data?.user;
  const rows = user?.emdUpdates ?? [];

  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "";

  const columns = useMemo((): TableColumn<EmdUpdateRow>[] => {
    return [
      { id: "emdNo", header: "EMD Number", accessor: "emdNo" },
      {
        id: "vehicleBuyingLimitIncrement",
        header: "Vehicle Buying Limit",
        accessor: "vehicleBuyingLimitIncrement",
      },
      {
        id: "amount",
        header: "Amount",
        cell: (row) => row.payment?.amount ?? "—",
      },
      {
        id: "createdAt",
        header: "Created At",
        cell: (row) => (row.createdAt ? formatDate(row.createdAt) : "—"),
      },
      {
        id: "createdBy",
        header: "Created By",
        cell: (row) => {
          const createdById = row.createdBy?.id ?? row.createdById;
          if (!createdById) return "—";

          return (
            <Link
              href={ROUTES.userDetail(createdById)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
              title={row.createdBy?.firstName ?? "View user"}
            >
              <User className="h-4 w-4" />
            </Link>
          );
        },
      },
      {
        id: "editPayment",
        header: "Update Buying Limit",
        cell: (row) => {
          const paymentId = row.payment?.id;
          if (!paymentId) return "—";

          return (
            <Can permission={PERMISSIONS.PAYMENTS_MANAGE}>
              <Link
                href={ROUTES.addEmd(paymentId)}
                className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Update
              </Link>
            </Can>
          );
        },
      },
    ];
  }, []);

  if (!canFetch || (loading && !user)) {
    return <LoadingState label="Loading buying limit details…" />;
  }

  if (error || !user) {
    return (
      <PageContainer title="Buying Limit Details">
        <EmptyState
          title="User not found"
          description={
            error
              ? extractGraphqlError(error).message
              : "The requested user could not be loaded."
          }
          action={
            <Link href={ROUTES.users} className={buttonVariants({ variant: "outline" })}>
              Back to Users
            </Link>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Buying Limit Details"
      description={
        userName
          ? `EMD buying limit history for ${userName}.`
          : "EMD buying limit history for this user."
      }
      actions={
        <Link
          href={ROUTES.userDetail(userId)}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to User
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={rows}
        variant="users"
        emptyTitle="No buying limit updates"
        emptyDescription="EMD buying limit adjustments for this user will appear here."
      />
    </PageContainer>
  );
}
