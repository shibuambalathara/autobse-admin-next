"use client";

import type { ReactNode } from "react";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

interface VahanSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading?: boolean;
  placeholder?: string;
  searchLabel?: string;
  rightAction?: ReactNode;
  className?: string;
}

export function VahanSearch({
  value,
  onChange,
  onSearch,
  loading = false,
  placeholder = "Enter Registration Number",
  searchLabel = "Search",
  rightAction,
  className,
}: VahanSearchProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", className)}>
      <Input
        value={value}
        onChange={(e) =>
          onChange(e.target.value.replace(/\s+/g, "").toUpperCase())
        }
        placeholder={placeholder}
        className="flex-1 text-base"
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch();
        }}
      />

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={onSearch} isLoading={loading}>
          {searchLabel}
        </Button>
        {rightAction}
      </div>
    </div>
  );
}
