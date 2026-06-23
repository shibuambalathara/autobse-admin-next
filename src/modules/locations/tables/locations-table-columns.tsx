"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui";
import { formatStateDisplay } from "@/modules/users/utils";
import type { Location } from "@/modules/locations/types";
import type { TableColumn } from "@/types";

export function createLocationsTableColumns(options: {
  canManage: boolean;
  onEdit: (location: Location) => void;
}): TableColumn<Location>[] {
  const { canManage, onEdit } = options;

  const columns: TableColumn<Location>[] = [
    {
      id: "name",
      header: "City",
      accessor: "name",
      sticky: true,
      mobilePrimary: true,
    },
    {
      id: "state",
      header: "State",
      cell: (row) => formatStateDisplay(row.state?.name),
    },
  ];

  if (canManage) {
    columns.push({
      id: "edit",
      header: "Edit",
      mobileFooter: true,
      cell: (row) => (
        <Button
          type="button"
          size="icon"
          className="h-8 w-8 bg-red-500 hover:bg-red-600"
          onClick={() => onEdit(row)}
          title={`Edit ${row.name}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    });
  }

  return columns;
}
