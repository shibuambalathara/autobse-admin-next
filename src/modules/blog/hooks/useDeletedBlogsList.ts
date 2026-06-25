"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import {
  DELETED_BLOGS_QUERY,
  RESTORE_BLOG_MUTATION,
} from "@/graphql/documents/blogs";
import { BLOGS_PAGE_SIZE } from "@/modules/blog/constants";
import { useAuthenticatedAdminQuery } from "@/modules/blog/hooks/useAuthenticatedAdminQuery";
import type { Blog, DeletedBlogsResult } from "@/modules/blog/types";
import { useDebouncedValue } from "@/modules/users/utils/useDebouncedValue";

export function useDeletedBlogsList() {
  const { canFetch } = useAuthenticatedAdminQuery();
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebouncedValue(searchInput.trim());
  const [page, setPage] = useState(1);
  const isSearching = Boolean(searchQuery);

  const queryVariables = useMemo(
    () => ({
      search: searchQuery || undefined,
      skip: isSearching ? undefined : (page - 1) * BLOGS_PAGE_SIZE,
      take: isSearching ? undefined : BLOGS_PAGE_SIZE,
      orderBy: [{ createdAt: "DESC" as const }],
    }),
    [isSearching, page, searchQuery]
  );

  const { data, loading, error, refetch } = useQuery<DeletedBlogsResult>(
    DELETED_BLOGS_QUERY,
    {
      variables: queryVariables,
      skip: !canFetch,
      fetchPolicy: "network-only",
    }
  );

  const [restoreBlog] = useMutation(RESTORE_BLOG_MUTATION);

  const blogs = useMemo(
    () => data?.deletedBlogs?.blogs ?? [],
    [data?.deletedBlogs?.blogs]
  );
  const total = data?.deletedBlogs?.deletedBlogCount ?? 0;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const restore = async (blog: Blog) => {
    const result = await Swal.fire({
      title: "Restore this blog?",
      html: `Title: <strong>${blog.title ?? "—"}</strong>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Restore",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await restoreBlog({ variables: { where: { id: blog.id } } });
      await refetch();
      await Swal.fire({
        icon: "success",
        title: "Restored",
        text: "Blog restored successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to restore blog.";
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setPage(1);
  };

  return {
    blogs,
    total,
    loading: !canFetch || loading,
    error,
    searchInput,
    setSearchInput,
    page,
    setPage,
    pageSize: BLOGS_PAGE_SIZE,
    isSearching,
    canFetch,
    restore,
    clearFilters,
  };
}
