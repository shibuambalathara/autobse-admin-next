"use client";

import { Button } from "@/components/ui";
import { formatDate } from "@/lib/date-format";
import type { Enquiry } from "@/modules/enquiries/types";
import { formatStateDisplay } from "@/modules/users/utils";
import type { TableColumn } from "@/types";

function TruncatedText({
  text,
  limit,
  onViewMore,
  viewMoreLabel,
}: {
  text: string;
  limit: number;
  onViewMore: () => void;
  viewMoreLabel: string;
}) {
  if (!text) return <>—</>;
  if (text.length <= limit) return <>{text}</>;

  return (
    <>
      {text.slice(0, limit)}…{" "}
      <button
        type="button"
        onClick={onViewMore}
        className="text-sm font-medium text-brand-600 underline hover:text-brand-900"
      >
        {viewMoreLabel}
      </button>
    </>
  );
}

export interface EnquiriesTableColumnOptions {
  canManage: boolean;
  onViewText: (text: string, title: string) => void;
  onMarkSolved: (enquiryId: string) => void;
  solvingId?: string | null;
}

export function createEnquiriesTableColumns(
  options: EnquiriesTableColumnOptions
): TableColumn<Enquiry>[] {
  const { canManage, onViewText, onMarkSolved, solvingId } = options;

  return [
    {
      id: "firstName",
      header: "First Name",
      sticky: true,
      mobilePrimary: true,
      cell: (row) => (
        <TruncatedText
          text={row.firstName}
          limit={25}
          viewMoreLabel="View more"
          onViewMore={() => onViewText(row.firstName, "First Name")}
        />
      ),
    },
    {
      id: "lastName",
      header: "Last Name",
      cell: (row) => (
        <TruncatedText
          text={row.lastName}
          limit={25}
          viewMoreLabel="View more"
          onViewMore={() => onViewText(row.lastName, "Last Name")}
        />
      ),
    },
    {
      id: "mobile",
      header: "Mobile",
      accessor: "mobile",
    },
    {
      id: "state",
      header: "State",
      cell: (row) => formatStateDisplay(row.state),
    },
    {
      id: "message",
      header: "Message",
      cell: (row) => (
        <TruncatedText
          text={row.message}
          limit={50}
          viewMoreLabel="View more"
          onViewMore={() => onViewText(row.message, "Full Message")}
        />
      ),
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
      id: "status",
      header: "Status",
      mobileFooter: true,
      cell: (row) => {
        if (row.status === "created") {
          if (!canManage) {
            return (
              <span className="inline-flex rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                Unsolved
              </span>
            );
          }

          return (
            <Button
              type="button"
              size="sm"
              className="bg-red-500 hover:bg-red-600"
              isLoading={solvingId === row.id}
              loadingText="…"
              onClick={() => onMarkSolved(row.id)}
            >
              Unsolved
            </Button>
          );
        }

        return (
          <span className="inline-flex rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            Solved
          </span>
        );
      },
    },
  ];
}
