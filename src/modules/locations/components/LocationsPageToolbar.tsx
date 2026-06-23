"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileActionButtonClass =
  "box-border flex h-11 w-full max-w-full items-center justify-center gap-2 rounded-lg border border-neutral-900 bg-neutral-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-neutral-800";

interface LocationsPageToolbarProps {
  canManage: boolean;
  onAdd: () => void;
}

export function LocationsPageToolbar({
  canManage,
  onAdd,
}: LocationsPageToolbarProps) {
  if (!canManage) return null;

  return (
    <div className="mb-4 w-full min-w-0 max-w-full lg:hidden">
      <button type="button" className={cn(mobileActionButtonClass)} onClick={onAdd}>
        <Plus className="h-4 w-4 shrink-0" />
        <span className="truncate">Add location</span>
      </button>
    </div>
  );
}
