import type { ReactNode } from "react";
import type { TableColumn } from "@/types";

export function getCellContent<T>(
  column: TableColumn<T>,
  row: T
): ReactNode {
  if (column.cell) {
    return column.cell(row);
  }

  if (column.accessor) {
    const value = row[column.accessor];
    if (value === null || value === undefined || value === "") {
      return "—";
    }
    return String(value);
  }

  return "—";
}

export function getCellText<T>(column: TableColumn<T>, row: T): string {
  const content = getCellContent(column, row);

  if (typeof content === "string" || typeof content === "number") {
    return String(content);
  }

  if (column.accessor) {
    const value = row[column.accessor];
    if (value === null || value === undefined || value === "") {
      return "—";
    }
    return String(value);
  }

  return "";
}

export function resolveMobilePrimaryColumn<T>(
  columns: TableColumn<T>[]
): TableColumn<T> | undefined {
  return (
    columns.find((column) => column.mobilePrimary) ??
    columns.find((column) => !column.hideOnMobile && !column.mobileFooter) ??
    columns[0]
  );
}

export function partitionMobileColumns<T>(columns: TableColumn<T>[]) {
  const primary = resolveMobilePrimaryColumn(columns);
  const body: TableColumn<T>[] = [];
  const footer: TableColumn<T>[] = [];

  for (const column of columns) {
    if (column.hideOnMobile || column.id === primary?.id) {
      continue;
    }

    if (column.mobileFooter) {
      footer.push(column);
      continue;
    }

    body.push(column);
  }

  return { primary, body, footer };
}
