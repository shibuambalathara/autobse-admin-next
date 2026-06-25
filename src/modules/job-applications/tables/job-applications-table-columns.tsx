"use client";

import Link from "next/link";
import type { TableColumn } from "@/types";
import { ExternalLink, FilePenLine, UserPen } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { formatDate, formatDateOnly } from "@/lib/date-format";
import { formatJobApplicationStatus } from "@/modules/job-applications/constants";
import type { JobApplication } from "@/modules/job-applications/types";

export function createJobApplicationsTableColumns(options?: {
  onViewCoverLetter?: (text: string) => void;
  showDesignation?: boolean;
}): TableColumn<JobApplication>[] {
  const { onViewCoverLetter, showDesignation = true } = options ?? {};

  const columns: TableColumn<JobApplication>[] = [
    {
      id: "jobApplicationNo",
      header: "Job No",
      cell: (row) => row.jobApplicationNo ?? "—",
    },
    {
      id: "fullName",
      header: "Full Name",
      cell: (row) => row.fullName ?? "—",
    },
    {
      id: "mobile",
      header: "Mobile",
      cell: (row) => row.mobile ?? "—",
    },
    {
      id: "dateOfBirth",
      header: "DOB",
      cell: (row) => formatDateOnly(row.dateOfBirth),
    },
    {
      id: "gender",
      header: "Gender",
      cell: (row) => row.gender ?? "—",
    },
    {
      id: "yearOfExperience",
      header: "Experience",
      cell: (row) => row.yearOfExperience ?? "—",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => formatJobApplicationStatus(row.status),
    },
  ];

  if (showDesignation) {
    columns.push({
      id: "designation",
      header: "Designation",
      cell: (row) => row.career?.title ?? "—",
    });
  }

  columns.push(
    {
      id: "cv",
      header: "CV",
      cell: (row) =>
        row.CV ? (
          <a
            href={row.CV}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 underline hover:text-brand-900"
          >
            View CV
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="text-brand-400">Not uploaded</span>
        ),
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "career",
      header: "Career Details",
      mobileFooter: true,
      cell: (row) =>
        row.career?.id ? (
          <Link
            href={ROUTES.careerEdit(row.career.id)}
            title="View career"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            <UserPen className="h-4 w-4" />
          </Link>
        ) : (
          <span className="text-brand-400">No career</span>
        ),
    },
    {
      id: "profile",
      header: "Applicant Profile",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={ROUTES.jobApplicationDetail(row.id)}
          title="View application"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          <FilePenLine className="h-4 w-4" />
        </Link>
      ),
    }
  );

  if (onViewCoverLetter) {
    columns.splice(columns.findIndex((col) => col.id === "cv"), 0, {
      id: "coverLetter",
      header: "Cover Letter",
      cell: (row) =>
        row.coverLetter ? (
          <button
            type="button"
            onClick={() => onViewCoverLetter(row.coverLetter ?? "")}
            className="text-sm font-medium text-brand-600 underline hover:text-brand-900"
          >
            View letter
          </button>
        ) : (
          <span className="text-brand-400">Not provided</span>
        ),
    });
  }

  return columns;
}
