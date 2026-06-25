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
import { useBlogRowActions } from "@/modules/blog/hooks/useBlogRowActions";
import { useBlogsList } from "@/modules/blog/hooks/useBlogsList";
import { createBlogsTableColumns } from "@/modules/blog/tables/blogs-table-columns";

export function BlogsListView() {
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const list = useBlogsList();
  const actions = useBlogRowActions(() => list.refetch());

  const columns = useMemo(
    () => createBlogsTableColumns({ onDelete: actions.handleDelete }),
    [actions.handleDelete]
  );

  const showInitialLoading = !list.canFetch || (list.loading && list.blogs.length === 0);

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Blog access restricted"
        description="Only administrators can view and manage blogs."
      />
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageContainer
        title="Blog"
        description="Create and manage blog posts."
        actions={
          <div className="hidden flex-wrap gap-2 lg:flex">
            <Link
              href={ROUTES.blogsDeleted}
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Deleted Blogs
            </Link>
            <Link href={ROUTES.blogAdd} className={buttonVariants({ size: "sm" })}>
              <Plus className="h-4 w-4 shrink-0" />
              Add Blog
            </Link>
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
          <Link
            href={ROUTES.blogsDeleted}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Deleted Blogs
          </Link>
          <Link href={ROUTES.blogAdd} className={buttonVariants({ size: "sm" })}>
            <Plus className="h-4 w-4 shrink-0" />
            Add Blog
          </Link>
        </div>

        {showInitialLoading ? (
          <LoadingState label="Loading blogs…" />
        ) : list.error ? (
          <EmptyState
            title="Failed to load blogs"
            description={extractGraphqlError(list.error).message}
          />
        ) : (
          <DataTable
            columns={columns}
            data={list.blogs}
            variant="users"
            searchValue={list.searchInput}
            onSearchChange={list.setSearchInput}
            searchPlaceholder="Search by title, author…"
            pagination={{
              page: list.page,
              pageSize: list.pageSize,
              total: list.total,
            }}
            onPageChange={list.setPage}
            emptyTitle="No blogs found"
            emptyDescription="Try adjusting your search or add a new blog post."
          />
        )}
      </PageContainer>
    </div>
  );
}
