"use client";

import { formatDate } from "@/lib/date-format";
import type { PendingUserItem } from "@/modules/users/types";
import type { TableColumn } from "@/types";
import { formatStateDisplay } from "@/modules/users/utils";

export const pendingUsersTableColumns: TableColumn<PendingUserItem>[] = [
  {
    id: "firstName",
    header: "First Name",
    accessor: "firstName",
    sticky: true,
    mobilePrimary: true,
    className: "font-medium text-brand-900",
  },
  { id: "lastName", header: "Last Name", accessor: "lastName" },
  { id: "mobile", header: "Mobile", accessor: "mobile" },
  { id: "pancardNo", header: "PAN Card No", accessor: "pancardNo" },
  {
    id: "state",
    header: "State",
    cell: (row) => formatStateDisplay(row.state),
  },
  {
    id: "createdAt",
    header: "Created At",
    cell: (row) => formatDate(row.createdAt),
  },
];
