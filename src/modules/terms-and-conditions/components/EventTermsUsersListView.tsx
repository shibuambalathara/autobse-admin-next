"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, User } from "lucide-react";
import { useAccess } from "@/auth/use-access";
import { PERMISSIONS } from "@/auth/permissions";
import { PageContainer, Button, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { useEventTermsUsersList } from "@/modules/terms-and-conditions/hooks/useEventTermsUsersList";
import { TERMS_CONDITIONS_PAGE_SIZE } from "@/modules/terms-and-conditions/types";
import type { TermsConditionRow } from "@/modules/terms-and-conditions/types";
import type { TableColumn } from "@/types";

interface EventTermsUsersListViewProps {
  eventId: string;
}

export function EventTermsUsersListView({
  eventId,
}: EventTermsUsersListViewProps) {
  const { can } = useAccess();
  const canViewUsers = can(PERMISSIONS.USERS_READ);
  const list = useEventTermsUsersList(eventId);

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
        id: "user",
        header: "User",
        cell: (row) => {
          const userId = row.userId ?? row.createdById;
          if (!userId) return "—";

          if (!canViewUsers) return userId;

          return (
            <Link
              href={ROUTES.userDetail(userId)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
              title="View user"
            >
              <User className="h-4 w-4" />
            </Link>
          );
        },
      },
    ];
  }, [canViewUsers]);

  if (!list.canFetch || (list.loading && list.terms.length === 0)) {
    return <LoadingState label="Loading accepted users…" />;
  }

  if (list.error) {
    return (
      <PageContainer title="Terms & Conditions">
        <EmptyState
          title="Failed to load accepted users"
          description={extractGraphqlError(list.error).message}
          action={
            <Link
              href={ROUTES.events}
              className={buttonVariants({ variant: "outline" })}
            >
              Back to Events
            </Link>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Terms & Conditions"
      description="Users who have accepted terms for this event."
      actions={
        <Link
          href={ROUTES.events}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={list.terms}
        variant="users"
        searchValue={list.searchInput}
        onSearchChange={list.setSearchInput}
        searchPlaceholder="Search by user ID or status…"
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
        emptyTitle="No accepted users found"
        emptyDescription="No users have accepted terms for this event yet."
      />
    </PageContainer>
  );
}
