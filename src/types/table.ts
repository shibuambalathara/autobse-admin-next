import type { ReactNode } from "react";

export type TableResponsiveMode = "auto" | "scroll" | "cards";

export interface TableColumn<T> {
  id: string;
  header: string;
  accessor?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
  sticky?: boolean;
  /** Used only when `responsive="cards"`. */
  hideOnMobile?: boolean;
  /** Used only when `responsive="cards"`. */
  mobilePrimary?: boolean;
  /** Used only when `responsive="cards"`. */
  mobileFooter?: boolean;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface TableFilterOption {
  label: string;
  value: string;
}

export interface TableFilter {
  id: string;
  label: string;
  options: TableFilterOption[];
  value?: string;
}
