"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui";
import type { VehicleCategory } from "@/modules/vehicle-categories/types";
import type { TableColumn } from "@/types";

export function createVehicleCategoriesTableColumns(options: {
  canManage: boolean;
  onEdit: (category: VehicleCategory) => void;
}): TableColumn<VehicleCategory>[] {
  const { canManage, onEdit } = options;

  const columns: TableColumn<VehicleCategory>[] = [
    {
      id: "name",
      header: "Name",
      accessor: "name",
      sticky: true,
      mobilePrimary: true,
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
