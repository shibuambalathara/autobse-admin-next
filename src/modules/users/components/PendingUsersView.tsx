"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { PERMISSIONS } from "@/auth/permissions";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import { PageContainer, Select, Button, buttonVariants } from "@/components/ui";
import { FormField } from "@/components/forms";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { INDIAN_STATES } from "@/modules/users/constants";
import { pendingUsersTableColumns } from "@/modules/users/tables/pending-users-table-columns";
import { usePendingUsersList } from "@/modules/users/hooks/usePendingUsersList";
import { mapUsersForDisplay } from "@/modules/users/hooks/useUserRowActions";

export function PendingUsersView() {
  const { can } = useAccess();
  const canView = can(PERMISSIONS.USERS_PENDING);
  const list = usePendingUsersList();

  const displayUsers = useMemo(
    () => mapUsersForDisplay(list.users),
    [list.users]
  );

  const showInitialLoading = list.loading && displayUsers.length === 0;

  if (!canView) {
    return (
      <AccessDenied
        title="Pending users access restricted"
        description="Only administrators can view pending user registrations."
      />
    );
  }

  return (
    <PageContainer
      title="Pending Users"
      description="Users awaiting registration approval."
      actions={
        <Link
          href={ROUTES.users}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>
      }
    >
      <div className="mb-4 lg:hidden">
        <Link
          href={ROUTES.users}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormField label="State" htmlFor="pending-state">
          <Select
            id="pending-state"
            placeholder="All states"
            options={INDIAN_STATES}
            value={list.state}
            onChange={(e) => list.setState(e.target.value)}
          />
        </FormField>
        <div className="flex items-end">
          <Button size="sm" variant="outline" onClick={list.clearFilters}>
            Clear filters
          </Button>
        </div>
      </div>

      {showInitialLoading ? (
        <LoadingState label="Loading pending users…" />
      ) : list.error ? (
        <EmptyState
          title="Failed to load pending users"
          description={extractGraphqlError(list.error).message}
        />
      ) : (
        <DataTable
          columns={pendingUsersTableColumns}
          data={displayUsers}
          variant="users"
          searchValue={list.searchInput}
          onSearchChange={list.setSearchInput}
          searchPlaceholder="Search by name, mobile, or PAN…"
          pagination={{
            page: list.page,
            pageSize: list.pageSize,
            total: list.total,
          }}
          onPageChange={list.setPage}
          emptyTitle="No pending users"
          emptyDescription="No users match your search criteria."
        />
      )}
    </PageContainer>
  );
}
