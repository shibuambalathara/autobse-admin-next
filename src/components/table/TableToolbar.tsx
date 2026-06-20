"use client";

import { Search } from "lucide-react";
import { Input, Select } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { TableFilter } from "@/types";

interface TableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: TableFilter[];
  onFilterChange?: (filterId: string, value: string) => void;
  actions?: React.ReactNode;
  className?: string;
}

export function TableToolbar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search…",
  filters = [],
  onFilterChange,
  actions,
  className,
}: TableToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {onSearchChange && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
              aria-label="Search table"
            />
          </div>
        )}

        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Select
                key={filter.id}
                className="w-full sm:w-40"
                value={filter.value ?? ""}
                onChange={(e) => onFilterChange?.(filter.id, e.target.value)}
                placeholder={filter.label}
                options={filter.options}
                aria-label={filter.label}
              />
            ))}
          </div>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
