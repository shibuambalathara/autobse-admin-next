"use client";

import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui";
import {
  UsersFilterFields,
  type UsersFilterFieldsProps,
} from "@/modules/users/components/UsersFilterFields";
import { UsersFilterSlideOver } from "@/modules/users/components/UsersFilterSlideOver";

type UsersFiltersBarProps = UsersFilterFieldsProps & {
  onClear: () => void;
};

function countActiveFilters(props: UsersFilterFieldsProps) {
  let count = 0;
  if (props.registrationExpiryDate) count += 1;
  if (props.state) count += 1;
  if (props.role) count += 1;
  if (props.status) count += 1;
  return count;
}

export function UsersFiltersBar(props: UsersFiltersBarProps) {
  const { onClear, ...fieldProps } = props;
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const activeCount = useMemo(() => countActiveFilters(fieldProps), [fieldProps]);

  return (
    <section
      className="mb-4 flex flex-wrap items-center justify-between gap-2"
      aria-label="User filters"
    >
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

      {activeCount > 0 ? (
        <Button size="sm" variant="ghost" onClick={onClear}>
          Clear filters
        </Button>
      ) : (
        <span className="text-sm text-brand-500">No filters applied</span>
      )}

      <UsersFilterSlideOver
        open={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onClear={onClear}
        activeCount={activeCount}
      >
        <UsersFilterFields {...fieldProps} layout="stack" />
      </UsersFilterSlideOver>
    </section>
  );
}
