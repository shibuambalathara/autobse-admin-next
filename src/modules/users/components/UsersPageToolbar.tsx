"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Filter,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import {
  UsersFilterFields,
  type UsersFilterFieldsProps,
} from "@/modules/users/components/UsersFilterFields";
import { UsersFilterSlideOver } from "@/modules/users/components/UsersFilterSlideOver";

export type UsersPageToolbarProps = UsersFilterFieldsProps & {
  isAdmin: boolean;
  onClear: () => void;
  onDownloadExcel: () => void;
  onEmdExcel: () => void;
  onDeleteByDate: () => void;
};

function countActiveFilters(props: UsersFilterFieldsProps) {
  let count = 0;
  if (props.registrationExpiryDate) count += 1;
  if (props.state) count += 1;
  if (props.role) count += 1;
  if (props.status) count += 1;
  return count;
}

const mobileActionButtonClass =
  "box-border flex h-11 w-full max-w-full items-center justify-start gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-left text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-50";

export function UsersPageToolbar({
  isAdmin,
  onClear,
  onDownloadExcel,
  onEmdExcel,
  onDeleteByDate,
  ...fieldProps
}: UsersPageToolbarProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const activeCount = useMemo(() => countActiveFilters(fieldProps), [fieldProps]);

  const filterStatus =
    activeCount > 0 ? (
      <button
        type="button"
        onClick={onClear}
        className="text-sm text-brand-600 hover:text-brand-900"
      >
        {activeCount} filter{activeCount === 1 ? "" : "s"} applied · Clear
      </button>
    ) : (
      <span className="text-sm text-brand-500">No filters applied</span>
    );

  return (
    <div className="mb-4 w-full min-w-0 max-w-full">
      {/* Mobile */}
      <div className="w-full min-w-0 space-y-3 lg:hidden">
        <div className="grid w-full min-w-0 grid-cols-2 gap-2">
          <button
            type="button"
            className={cn(mobileActionButtonClass, "justify-center border-neutral-900")}
            onClick={() => setIsPanelOpen(true)}
          >
            <Filter className="h-4 w-4 shrink-0" />
            <span className="truncate">Filters</span>
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 px-1.5 text-xs text-white">
                {activeCount}
              </span>
            )}
          </button>

          <Link
            href={ROUTES.usersAdd}
            className={cn(
              mobileActionButtonClass,
              "justify-center border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
            )}
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="truncate">Add user</span>
          </Link>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-2">
          {isAdmin && (
            <>
              <button
                type="button"
                className={mobileActionButtonClass}
                onClick={onDownloadExcel}
              >
                <FileSpreadsheet className="h-4 w-4 shrink-0 text-neutral-500" />
                <span className="truncate">Download Excel</span>
              </button>
              <button
                type="button"
                className={mobileActionButtonClass}
                onClick={onEmdExcel}
              >
                <FileSpreadsheet className="h-4 w-4 shrink-0 text-neutral-500" />
                <span className="truncate">EMD approved Excel</span>
              </button>
            </>
          )}
          <button
            type="button"
            className={mobileActionButtonClass}
            onClick={onDeleteByDate}
          >
            <Trash2 className="h-4 w-4 shrink-0 text-neutral-500" />
            <span className="truncate">Delete by date</span>
          </button>
          <Link href={ROUTES.usersDeleted} className={mobileActionButtonClass}>
            <Users className="h-4 w-4 shrink-0 text-neutral-500" />
            <span className="truncate">Deleted users</span>
          </Link>
        </div>

        <div>{filterStatus}</div>
      </div>

      {/* Desktop */}
      <div className="hidden w-full min-w-0 lg:block">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsPanelOpen(true)}
          >
            <Filter className="h-4 w-4 shrink-0" />
            Filters
            {activeCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-900 px-1.5 text-xs text-white">
                {activeCount}
              </span>
            )}
          </Button>
          {filterStatus}
        </div>
      </div>

      <UsersFilterSlideOver
        open={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onClear={onClear}
        activeCount={activeCount}
      >
        <UsersFilterFields {...fieldProps} layout="stack" />
      </UsersFilterSlideOver>
    </div>
  );
}
