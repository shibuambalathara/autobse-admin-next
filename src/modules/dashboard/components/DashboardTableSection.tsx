"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusBadge,
} from "@/components/ui";
import { DataTable } from "@/components/table/DataTable";
import { DASHBOARD_PLACEHOLDER_OVERVIEW } from "@/modules/dashboard/constants/placeholder-data";
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
    header: "Last Updated",
    accessor: "updatedAt",
    className: "whitespace-nowrap text-brand-500",
  },
];

export function DashboardTableSection() {
  return (
    <Card padding="none" className="overflow-hidden">
      <CardHeader className="mb-0 border-b border-surface-border px-5 py-4">
        <div>
          <CardTitle>Overview</CardTitle>
          <CardDescription className="mt-0.5">
            Summary of recent records across modules.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5">
        <DataTable
          columns={overviewColumns}
          data={DASHBOARD_PLACEHOLDER_OVERVIEW}
          emptyTitle="No records"
          emptyDescription="Overview data will appear here once connected."
        />
      </CardContent>
    </Card>
  );
}
