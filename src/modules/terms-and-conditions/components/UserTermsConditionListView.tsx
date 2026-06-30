"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { ArrowLeft, Calendar } from "lucide-react";
import { useAuthenticatedQuery } from "@/auth/use-authenticated-query";
import { useAccess } from "@/auth/use-access";
import { PERMISSIONS } from "@/auth/permissions";
import { PageContainer, Button, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { VIEW_USER_QUERY } from "@/graphql/documents/users";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { useUserTermsConditionList } from "@/modules/terms-and-conditions/hooks/useUserTermsConditionList";
import { TERMS_CONDITIONS_PAGE_SIZE } from "@/modules/terms-and-conditions/types";
import type { TermsConditionRow } from "@/modules/terms-and-conditions/types";
import type { TableColumn } from "@/types";

interface UserTermsConditionListViewProps {
  userId: string;
}

export function UserTermsConditionListView({
  userId,
}: UserTermsConditionListViewProps) {
  const { can } = useAccess();
  const canViewEvents = can(PERMISSIONS.EVENTS_READ);
  const list = useUserTermsConditionList(userId);

  const { data: userData } = useQuery(VIEW_USER_QUERY, {
    variables: { where: { id: userId } },
    skip: !list.canFetch,
  });

  const user = userData?.user;
  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "";

  const columns = useMemo((): TableColumn<TermsConditionRow>[] => {
    return [
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
      {
        id: "event",
        header: "Event",
        cell: (row) =>
          canViewEvents ? (
            <Link
              href={ROUTES.eventEdit(row.eventId)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
              title="View event"
            >
              <Calendar className="h-4 w-4" />
            </Link>
          ) : (
            "—"
          ),
      },
    ];
  }, [canViewEvents]);

  if (!list.canFetch || (list.loading && list.terms.length === 0)) {
    return <LoadingState label="Loading accepted events…" />;
  }

  if (list.error) {
    return (
      <PageContainer title="Terms & Conditions">
        <EmptyState
          title="Failed to load accepted events"
          description={extractGraphqlError(list.error).message}
          action={
            <Link
              href={ROUTES.userDetail(userId)}
              className={buttonVariants({ variant: "outline" })}
            >
              Back to User
            </Link>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Terms & Conditions"
      description={
        userName
          ? `Accepted events for ${userName}.`
          : "Events this user has accepted terms for."
      }
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href={ROUTES.userDetail(userId)}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to User
          </Link>
          <Link
            href={ROUTES.userArchivedTermsCondition(userId)}
            className={buttonVariants({ size: "sm", variant: "secondary" })}
          >
            View Archived Accepted Events
          </Link>
        </div>
      }
    >
      <DataTable
        columns={columns}
        data={list.terms}
        variant="users"
        searchValue={list.searchInput}
        onSearchChange={list.setSearchInput}
        searchPlaceholder="Search by event ID or status…"
        toolbarActions={
          <Button size="sm" variant="outline" onClick={list.clearFilters}>
            Clear
          </Button>
        }
        pagination={{
          page: list.page,
          pageSize: TERMS_CONDITIONS_PAGE_SIZE,
          total: list.total,
        }}
        onPageChange={list.setPage}
        emptyTitle="No accepted events found"
        emptyDescription="This user has not accepted terms for any events yet."
      />
    </PageContainer>
  );
}
