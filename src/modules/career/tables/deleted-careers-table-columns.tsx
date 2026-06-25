"use client";

import Link from "next/link";
import type { TableColumn } from "@/types";
import { RotateCcw, UserPen } from "lucide-react";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import { formatJobDepartment, formatJobType } from "@/modules/career/constants";
import type { Career } from "@/modules/career/types";

export function createDeletedCareersTableColumns(options: {
  onRestore: (career: Career) => void;
}): TableColumn<Career>[] {
  const { onRestore } = options;

  return [
    {
      id: "careerNo",
      header: "Career No",
      cell: (row) => row.careerNo ?? "—",
    },
    {
      id: "title",
      header: "Designation",
      cell: (row) => row.title ?? "—",
    },
    {
      id: "type",
      header: "Type",
      cell: (row) => formatJobType(row.type),
    },
    {
      id: "location",
      header: "Location",
      cell: (row) => row.location ?? "—",
    },
    {
      id: "category",
      header: "Category",
      cell: (row) => formatJobDepartment(row.category),
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
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
          className="h-8 w-8"
          onClick={() => onRestore(row)}
          title="Restore career"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "createdBy",
      header: "Created By",
      mobileFooter: true,
      cell: (row) =>
        row.createdBy?.id ? (
          <Link
            href={ROUTES.userDetail(row.createdBy.id)}
            title="View user"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            <UserPen className="h-4 w-4" />
          </Link>
        ) : (
          "—"
        ),
    },
  ];
}
