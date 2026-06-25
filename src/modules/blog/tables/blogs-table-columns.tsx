"use client";

import type { TableColumn } from "@/types";
import Link from "next/link";
import { FilePenLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date-format";
import {
  formatBlogCategory,
} from "@/modules/blog/constants";
import type { Blog } from "@/modules/blog/types";

export function createBlogsTableColumns(options: {
  onDelete: (blog: Blog) => void;
}): TableColumn<Blog>[] {
  const { onDelete } = options;

  return [
    {
      id: "blogNo",
      header: "Blog No",
      cell: (row) => row.blogNo ?? "—",
    },
    {
      id: "title",
      header: "Title",
      cell: (row) => row.title ?? "—",
    },
    {
      id: "author",
      header: "Author",
      cell: (row) => row.author ?? "—",
    },
    {
      id: "category",
      header: "Category",
      cell: (row) => formatBlogCategory(row.category),
    },
    {
      id: "image",
      header: "Image",
      cell: (row) =>
        row.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.image}
            alt={row.title ?? "Blog thumbnail"}
            className="h-14 w-14 rounded-md object-cover"
          />
        ) : (
          <span className="text-brand-400">No image</span>
        ),
    },
    {
      id: "createdAt",
      header: "Created At",
      cell: (row) => formatDate(row.createdAt),
    },
    {
      id: "edit",
      header: "View / Edit",
      mobileFooter: true,
      cell: (row) => (
        <Link
          href={ROUTES.blogEdit(row.id)}
          title="Edit blog"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          <FilePenLine className="h-4 w-4" />
        </Link>
      ),
    },
    {
      id: "delete",
      header: "Action",
      mobileFooter: true,
      cell: (row) => (
        <Button
          type="button"
          size="icon"
          variant="danger"
          className="h-8 w-8"
          onClick={() => onDelete(row)}
          title="Delete blog"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}
