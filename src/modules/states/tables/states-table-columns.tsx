"use client";

import type { State } from "@/modules/states/types";
import { formatStateDisplay } from "@/modules/users/utils";
import type { TableColumn } from "@/types";

export function createStatesTableColumns(): TableColumn<State>[] {
  return [
    {
      id: "name",
      header: "Name",
      cell: (row) => formatStateDisplay(row.name),
      sticky: true,
      mobilePrimary: true,
    },
  ];
}
