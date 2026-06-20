"use client";

import Link from "next/link";
import { RotateCcw, UserPen } from "lucide-react";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import type { DeletedUserItem } from "@/modules/users/types";
import type { TableColumn } from "@/types";

export function createDeletedUsersTableColumns(
  onRestore: (user: DeletedUserItem) => void
): TableColumn<DeletedUserItem>[] {
  return [
    {
      id: "idNo",
      header: "User No",
      accessor: "idNo",
      sticky: true,
      mobilePrimary: true,
    },
    {
      id: "firstName",
      header: "First Name",
      accessor: "firstName",
      className: "font-medium text-brand-900",
    },
    { id: "lastName", header: "Last Name", accessor: "lastName" },
    { id: "mobile", header: "Mobile", accessor: "mobile" },
    { id: "role", header: "Role", accessor: "role" },
    { id: "state", header: "State", accessor: "state" },
    {
      id: "deletedAt",
      header: "Deleted At",
      cell: (row) => formatDate(row.deletedAt),
    },
    {
      id: "restore",
      header: "Restore",
      mobileFooter: true,
      cell: (row) => (
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8 text-emerald-700"
          onClick={() => onRestore(row)}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "deletedBy",
      header: "Deleted By",
      mobileFooter: true,
      cell: (row) =>
        row.deletedById ? (
          <Link
            href={ROUTES.userDetail(row.deletedById)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100"
          >
            <UserPen className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
    },
  ];
}
