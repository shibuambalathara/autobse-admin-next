"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useAuthenticatedQuery } from "@/auth/use-authenticated-query";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { USER_ARCHIVED_TERMS_QUERY } from "@/graphql/documents/terms-and-conditions";
import { VIEW_USER_QUERY } from "@/graphql/documents/users";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import { extractGraphqlError } from "@/lib/graphql-errors";
import type {
  ArchivedTermsRow,
  UserArchivedTermsResult,
} from "@/modules/terms-and-conditions/types";
import type { TableColumn } from "@/types";

interface UserArchivedTermsListViewProps {
  userId: string;
}

export function UserArchivedTermsListView({
  userId,
}: UserArchivedTermsListViewProps) {
  const { canFetch } = useAuthenticatedQuery();

  const { data: userData } = useQuery(VIEW_USER_QUERY, {
    variables: { where: { id: userId } },
    skip: !canFetch,
  });

  const { data, loading, error } = useQuery<UserArchivedTermsResult>(
    USER_ARCHIVED_TERMS_QUERY,
    {
      variables: { where: { userId } },
      fetchPolicy: "network-only",
      skip: !canFetch,
    }
  );

  const user = userData?.user;
  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "";
  const terms = data?.termsAndConditionsArchive?.termsAndConditionsArchive ?? [];

  const columns = useMemo((): TableColumn<ArchivedTermsRow>[] => {
    return [
      {
        id: "archivedAt",
        header: "Archived At",
        cell: (row) => (row.archivedAt ? formatDate(row.archivedAt) : "—"),
      },
      {
        id: "archivedEvent",
        header: "Archived Event",
        cell: (row) =>
          row.eventArchiveId ? (
            <Link
              href={ROUTES.archiveEventVehicles(row.eventArchiveId)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
              title="View archived event"
            >
              <Calendar className="h-4 w-4" />
            </Link>
          ) : (
            "—"
          ),
      },
      {
        id: "archivedBy",
        header: "Archived By",
        cell: (row) =>
          row.archivedById ? (
            <Link
              href={ROUTES.userDetail(row.archivedById)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-700 text-white hover:bg-blue-800"
              title="View user"
            >
              <User className="h-4 w-4" />
            </Link>
          ) : (
            "—"
          ),
      },
      {
        id: "createdAt",
        header: "Created At",
        cell: (row) => (row.createdAt ? formatDate(row.createdAt) : "—"),
      },
      {
        id: "updatedAt",
        header: "Updated At",
        cell: (row) => (row.updatedAt ? formatDate(row.updatedAt) : "—"),
      },
    ];
  }, []);

  if (!canFetch || (loading && terms.length === 0)) {
    return <LoadingState label="Loading archived accepted events…" />;
  }

  if (error) {
    return (
      <PageContainer title="Archived Accepted Events">
        <EmptyState
          title="Failed to load archived events"
          description={extractGraphqlError(error).message}
          action={
            <Link
              href={ROUTES.userTermsCondition(userId)}
              className={buttonVariants({ variant: "outline" })}
            >
              Back
            </Link>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Archived Accepted Events"
      description={
        userName
          ? `Archived terms acceptance history for ${userName}.`
          : "Archived terms acceptance history for this user."
      }
      actions={
        <Link
          href={ROUTES.userTermsCondition(userId)}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Accepted Events
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={terms}
        variant="users"
        emptyTitle="No archived accepted events"
        emptyDescription="Archived terms acceptance records will appear here."
      />
    </PageContainer>
  );
}
