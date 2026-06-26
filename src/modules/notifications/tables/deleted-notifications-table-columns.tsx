"use client";

import Link from "next/link";
import { RotateCcw, UserPen } from "lucide-react";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { formatNotificationType } from "@/modules/notifications/constants";
import type { DeletedNotificationItem } from "@/modules/notifications/types";
import type { TableColumn } from "@/types";

export function createDeletedNotificationsTableColumns(options: {
  onRestore: (notification: DeletedNotificationItem) => void;
  showCreatedBy?: boolean;
}): TableColumn<DeletedNotificationItem>[] {
  const { onRestore, showCreatedBy = true } = options;

  const columns: TableColumn<DeletedNotificationItem>[] = [
    {
      id: "notificationNo",
      header: "Notification No",
      cell: (row) => row.notificationNo ?? "—",
      sticky: true,
      mobilePrimary: true,
    },
    {
      id: "title",
      header: "Title",
      accessor: "title",
      className: "font-medium text-brand-900",
    },
    {
      id: "type",
      header: "Type",
      cell: (row) => formatNotificationType(row.type),
    },
    {
      id: "message",
      header: "Message",
      accessor: "message",
      className: "max-w-xs truncate",
    },
  ];

  if (showCreatedBy) {
    columns.push({
      id: "createdBy",
      header: "Created By",
      cell: (row) => {
        const createdById = row.createdBy?.id;
        if (!createdById) return "—";
        return (
          <Link
            href={ROUTES.userDetail(createdById)}
            className="inline-flex items-center text-brand-700 hover:text-brand-900"
            aria-label="View user"
          >
            <UserPen className="h-4 w-4" />
          </Link>
        );
      },
    });
  }

  columns.push({
    id: "restore",
    header: "Restore",
    mobileFooter: true,
    cell: (row) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() => onRestore(row)}
        aria-label="Restore notification"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    ),
  });

  return columns;
}
