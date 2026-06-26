"use client";

import Link from "next/link";
import type { TableColumn } from "@/types";
import { UserPen } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import { formatAuditEntityType } from "@/modules/audit-logs/constants";
import type { AuditLog } from "@/modules/audit-logs/types";

export function createAuditLogsTableColumns(options: {
  onViewChanges: (changes: unknown) => void;
}): TableColumn<AuditLog>[] {
  const { onViewChanges } = options;

  return [
    {
      id: "entityType",
      header: "Entity Type",
      cell: (row) => formatAuditEntityType(row.entityType),
    },
    {
      id: "entityId",
      header: "Entity ID",
      cell: (row) => row.entityId ?? "—",
    },
    {
      id: "action",
      header: "Action",
      cell: (row) => row.action ?? "—",
    },
    {
      id: "changes",
      header: "Changes",
      cell: (row) =>
        row.changes ? (
          <button
            type="button"
            onClick={() => onViewChanges(row.changes)}
            className="text-sm font-medium text-brand-600 underline hover:text-brand-900"
          >
            View changes
          </button>
        ) : (
          "—"
        ),
    },
    {
      id: "changedByRole",
      header: "Changed By Role",
      cell: (row) => row.changedByRole ?? "—",
    },
    {
      id: "changedByUserId",
      header: "Changed By",
      mobileFooter: true,
      cell: (row) =>
        row.changedByUserId ? (
          <Link
            href={ROUTES.userDetail(row.changedByUserId)}
            title="View user"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            <UserPen className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
  ];
}
