"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Plus } from "lucide-react";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import { PageContainer, buttonVariants } from "@/components/ui";
import { DataTable } from "@/components/table";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { CareerFilterFields } from "@/modules/career/components/CareerFilterFields";
import { useCareerRowActions } from "@/modules/career/hooks/useCareerRowActions";
import { useCareersList } from "@/modules/career/hooks/useCareersList";
import { createCareersTableColumns } from "@/modules/career/tables/careers-table-columns";

export function CareersListView() {
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const list = useCareersList();
  const actions = useCareerRowActions(() => list.refetch());

  const columns = useMemo(
    () => createCareersTableColumns({ onDelete: actions.handleDelete }),
    [actions.handleDelete]
  );

  const showInitialLoading =
    !list.canFetch || (list.loading && list.careers.length === 0);

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Career access restricted"
        description="Only administrators can view and manage careers."
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Careers"
        description="Manage job openings and career postings."
        actions={
          <div className="hidden flex-wrap gap-2 lg:flex">
            <Link
              href={ROUTES.careersDeleted}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Deleted Careers
            </Link>
            <Link href={ROUTES.careerAdd} className={buttonVariants({ size: "sm" })}>
              <Plus className="h-4 w-4 shrink-0" />
              Add Career
            </Link>
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
          <Link
            href={ROUTES.careersDeleted}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Deleted Careers
          </Link>
          <Link href={ROUTES.careerAdd} className={buttonVariants({ size: "sm" })}>
            <Plus className="h-4 w-4 shrink-0" />
            Add Career
          </Link>
        </div>

        <CareerFilterFields
          category={list.category}
          type={list.type}
          location={list.location}
          urgency={list.urgency}
          locationOptions={list.locationOptions}
          onCategoryChange={list.setCategory}
          onTypeChange={list.setType}
          onLocationChange={list.setLocation}
          onUrgencyChange={list.setUrgency}
          onClear={list.clearFilters}
        />

        {showInitialLoading ? (
          <LoadingState label="Loading careers…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load careers"
            description={extractGraphqlError(list.error).message}
          />
        ) : (
          <DataTable
            columns={columns}
            data={list.careers}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by title, location…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No careers found"
            emptyDescription="Try adjusting your search or filters."
          />
        )}
      </PageContainer>
    </div>
  );
}
