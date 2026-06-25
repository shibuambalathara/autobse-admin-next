"use client";

import type { TableColumn } from "@/types";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/date-format";
import type { Blog } from "@/modules/blog/types";

export function createDeletedBlogsTableColumns(options: {
  onRestore: (blog: Blog) => void;
}): TableColumn<Blog>[] {
  const { onRestore } = options;

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
      id: "updatedAt",
      header: "Deleted At",
      cell: (row) => formatDate(row.updatedAt),
    },
    {
      id: "restore",
      header: "Action",
      mobileFooter: true,
      cell: (row) => (
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={() => onRestore(row)}
          title="Restore blog"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      ),
    },
  ];
}
