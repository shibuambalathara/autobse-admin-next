"use client";

import Link from "next/link";
import { Eye, Trash2, UserPen } from "lucide-react";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/date-format";
import { ROUTES } from "@/constants/routes";
import type { CrmCallLog } from "@/modules/crm/types";
import { formatCallDuration, getCallStatusLabel } from "@/modules/crm/utils";
import type { TableColumn } from "@/types";

function actionLinkClass(tone: string) {
  return `inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium text-white ${tone}`;
}

export function createCallLogsTableColumns(options: {
  onDelete: (callLog: CrmCallLog) => void;
  canEdit: boolean;
  showStaffColumn?: boolean;
}): TableColumn<CrmCallLog>[] {
  const { onDelete, canEdit, showStaffColumn = true } = options;

  const columns: TableColumn<CrmCallLog>[] = [];

  if (showStaffColumn) {
    columns.push({
      id: "staff",
      header: "Staff",
      cell: (row) => row.staff?.firstName ?? "—",
    });
  }

  columns.push(
    {
      id: "callStatus",
      header: "Call Status",
      cell: (row) => getCallStatusLabel(row.callStatus),
    },
    {
      id: "duration",
      header: "Duration",
      cell: (row) => formatCallDuration(row.durationInSeconds),
    },
    {
      id: "remarks",
      header: "Remarks",
      cell: (row) => (
        <span className="block max-w-xs truncate" title={row.remarks ?? ""}>
          {row.remarks || "—"}
        </span>
      ),
    },
    {
      id: "nextFollowUpAt",
      header: "Next Follow Up",
      cell: (row) => formatDate(row.nextFollowUpAt),
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "updatedAt",
      header: "Updated At",
      cell: (row) => formatDate(row.updatedAt),
    },
    {
      id: "edit",
      header: "Edit",
      mobileFooter: true,
      cell: (row) =>
        canEdit ? (
          <Link
            href={ROUTES.crmCallLogEdit(row.id)}
            title="Edit call log"
            className={actionLinkClass("bg-cyan-500 hover:bg-cyan-600")}
          >
            <UserPen className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
    },
    {
      id: "delete",
      header: "Delete",
      mobileFooter: true,
      cell: (row) => (
        <Button
          type="button"
          size="icon"
          variant="danger"
          className="h-8 w-8"
          onClick={() => onDelete(row)}
          title="Delete call log"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "createdBy",
      header: "Created By",
      mobileFooter: true,
      cell: (row) => {
        const createdById = row.createdById ?? row.createdBy?.id;
        return createdById ? (
          <Link
            href={ROUTES.userDetail(createdById)}
            className={actionLinkClass("bg-blue-600 hover:bg-blue-700")}
          >
            <Eye className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        );
      },
    }
  );

  return columns;
}
