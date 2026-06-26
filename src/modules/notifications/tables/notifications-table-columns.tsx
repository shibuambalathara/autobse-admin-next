"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import {
  formatNotificationType,
  formatReadStatus,
} from "@/modules/notifications/constants";
import type { NotificationItem } from "@/modules/notifications/types";
import type { TableColumn } from "@/types";

export function createNotificationsTableColumns(options: {
  onDelete: (notification: NotificationItem) => void;
  showViewUser?: boolean;
}): TableColumn<NotificationItem>[] {
  const { onDelete, showViewUser = true } = options;

  const columns: TableColumn<NotificationItem>[] = [
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
    {
      id: "isRead",
      header: "Status",
      cell: (row) => formatReadStatus(row.isRead),
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
  ];

  if (showViewUser) {
    columns.push({
      id: "viewUser",
      header: "View User",
      cell: (row) => (
        <Link
          href={ROUTES.userDetail(row.userId)}
          className="text-sm font-medium text-brand-700 hover:underline"
        >
          View User
        </Link>
      ),
    });
  }

  columns.push({
    id: "actions",
    header: "Action",
    mobileFooter: true,
    cell: (row) => (
      <Button
        size="sm"
        variant="outline"
        className="text-red-600 hover:text-red-700"
        onClick={() => onDelete(row)}
        aria-label="Delete notification"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    ),
  });

  return columns;
}
