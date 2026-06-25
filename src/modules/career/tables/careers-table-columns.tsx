"use client";

import Link from "next/link";
import type { TableColumn } from "@/types";
import { FilePenLine, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import {
  formatCareerUrgency,
  formatJobDepartment,
  formatJobType,
} from "@/modules/career/constants";
import type { Career } from "@/modules/career/types";

export function createCareersTableColumns(options: {
  onDelete: (career: Career) => void;
}): TableColumn<Career>[] {
  const { onDelete } = options;

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
      id: "category",
      header: "Category",
      cell: (row) => formatJobDepartment(row.category),
    },
    {
      id: "location",
      header: "Location",
      cell: (row) => row.location ?? "—",
    },
    {
      id: "type",
      header: "Type",
      cell: (row) => formatJobType(row.type),
    },
    {
      id: "yearOfExperience",
      header: "Experience",
      cell: (row) => row.yearOfExperience ?? "—",
    },
    {
      id: "urgency",
      header: "Urgency",
      cell: (row) => formatCareerUrgency(row.urgency),
    },
    {
      id: "package",
      header: "Package",
      cell: (row) => row.package ?? "—",
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "applicationDeadline",
      header: "Deadline",
      cell: (row) => formatDate(row.applicationDeadline),
    },
    {
      id: "edit",
      header: "View / Edit",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={ROUTES.careerEdit(row.id)}
          title="Edit career"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          <FilePenLine className="h-4 w-4" />
        </Link>
      ),
    },
    {
      id: "applications",
      header: "View Jobs",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={ROUTES.careerApplications(row.id)}
          title="View job applications"
          className="inline-flex h-8 items-center justify-center gap-1 rounded-md bg-emerald-600 px-2 text-xs font-medium text-white hover:bg-emerald-700"
        >
          <Users className="h-4 w-4" />
          Jobs
        </Link>
      ),
    },
    {
      id: "delete",
      header: "Action",
      mobileFooter: true,
      cell: (row) => (
        <Button
          type="button"
          size="icon"
          variant="danger"
          className="h-8 w-8"
          onClick={() => onDelete(row)}
          title="Delete career"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}
