"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAuth } from "@/auth/use-auth";
import { PageContainer, Select, Button, buttonVariants } from "@/components/ui";
import { FormField } from "@/components/forms";
import { DataTable } from "@/components/table";
import { LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { INDIAN_STATES } from "@/modules/users/constants";
import { createDeletedUsersTableColumns } from "@/modules/users/tables/deleted-users-table-columns";
import { useDeletedUsersList } from "@/modules/users/hooks/useDeletedUsersList";
import { mapUsersForDisplay } from "@/modules/users/hooks/useUserRowActions";

export function DeletedUsersView() {
  const { user } = useAuth();
  const isAdmin = isRole(user?.role ?? null, APP_ROLES.ADMIN);
  const list = useDeletedUsersList();
  const displayUsers = useMemo(
    () => mapUsersForDisplay(list.users),
    [list.users]
  );

  const columns = useMemo(
    () =>
      createDeletedUsersTableColumns((user) =>
        list.restore(user.id, user)
      ),
    [list]
  );

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Deleted users access restricted"
        description="Only administrators can view deleted users."
      />
    );
  }

  return (
    <PageContainer
      title="Deleted Users"
      description="Restore soft-deleted user accounts."
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
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormField label="Search" htmlFor="deleted-search">
          <input
            id="deleted-search"
            className="h-9 w-full rounded-md border border-surface-border px-3 text-sm"
            placeholder="Search by name or mobile…"
            value={list.searchInput}
            onChange={(e) => list.setSearchInput(e.target.value)}
          />
        </FormField>
        <FormField label="State" htmlFor="deleted-state">
          <Select
            id="deleted-state"
            placeholder="All states"
            options={INDIAN_STATES}
            value={list.state}
            onChange={(e) => list.setState(e.target.value)}
          />
        </FormField>
        <div className="flex items-end">
          <Button size="sm" variant="ghost" onClick={list.clearFilters}>
            Clear filters
          </Button>
        </div>
      </div>

      {list.loading && displayUsers.length === 0 ? (
        <LoadingState label="Loading deleted users…" />
      ) : (
        <DataTable
          columns={columns}
          data={displayUsers}
          pagination={{
            page: list.page,
            pageSize: list.pageSize,
            total: list.total,
          }}
          onPageChange={list.setPage}
          emptyTitle="No deleted users"
          emptyDescription="No deleted users match your search criteria."
        />
      )}
    </PageContainer>
  );
}
