"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { DELETE_BLOG_MUTATION } from "@/graphql/documents/blogs";
import type { Blog } from "@/modules/blog/types";

export function useBlogRowActions(onChanged: () => void) {
  const [deleteBlog] = useMutation(DELETE_BLOG_MUTATION);

  const handleDelete = useCallback(
    async (blog: Blog) => {
      const result = await Swal.fire({
        title: "Delete this blog?",
        html: `Title: ${blog.title ?? "—"}<br/>Author: ${blog.author ?? "—"}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      try {
        await deleteBlog({ variables: { where: { id: blog.id } } });
        onChanged();
        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Blog deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to delete blog.";
        await Swal.fire({ icon: "error", title: "Failed", text: message });
      }
    },
    [deleteBlog, onChanged]
  );

  return { handleDelete };
}
