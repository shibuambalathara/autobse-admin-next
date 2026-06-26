"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusBadge,
  buttonVariants,
} from "@/components/ui";
import { DataTable } from "@/components/table/DataTable";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { useDashboardContext } from "@/modules/dashboard/context/DashboardDataContext";
import type { DashboardOverviewRow } from "@/modules/dashboard/types";
import type { TableColumn } from "@/types";

const overviewColumns: TableColumn<DashboardOverviewRow>[] = [
  {
    id: "name",
    header: "Name",
    accessor: "name",
    className: "font-medium text-brand-900",
  },
  {
    id: "type",
    header: "Type",
    accessor: "type",
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} showDot />,
  },
  {
    id: "updatedAt",
    header: "Created At",
    accessor: "updatedAt",
    className: "whitespace-nowrap text-brand-500",
  },
];

export function DashboardTableSection() {
  const { overviewRows, overviewLoading, overviewError, canViewEvents } =
    useDashboardContext();

  if (!canViewEvents) {
    return (
      <Card padding="none" className="overflow-hidden">
        <CardHeader className="mb-0 border-b border-surface-border px-5 py-4">
          <div>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription className="mt-0.5">
              Event overview is not available for your role.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <EmptyState
            title="No event access"
            description="You do not have permission to view events."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <CardHeader className="mb-0 border-b border-surface-border px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription className="mt-0.5">
              Latest auction events in the system.
            </CardDescription>
          </div>
          <Link
            href={ROUTES.events}
            className={buttonVariants({ size: "sm", variant: "ghost" })}
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        {overviewLoading ? (
          <LoadingState label="Loading recent events…" />
        ) : overviewError ? (
          <EmptyState
            title="Failed to load events"
            description={extractGraphqlError(overviewError).message}
          />
        ) : (
          <DataTable
            columns={overviewColumns}
            data={overviewRows}
            emptyTitle="No recent events"
            emptyDescription="New events will appear here once created."
          />
        )}
      </CardContent>
    </Card>
  );
}
