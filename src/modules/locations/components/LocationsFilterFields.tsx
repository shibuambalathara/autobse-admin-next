"use client";

import { Select } from "@/components/ui";
import { INDIAN_STATES } from "@/modules/users/constants";
import { formatStateDisplay } from "@/modules/users/utils";

interface LocationsFilterFieldsProps {
  stateFilter: string;
  onStateChange: (value: string) => void;
}

export function LocationsFilterFields({
  stateFilter,
  onStateChange,
}: LocationsFilterFieldsProps) {
  const stateOptions = [
    { label: "All states", value: "" },
    ...INDIAN_STATES.map((state) => ({
      value: state.value,
      label: formatStateDisplay(state.label),
    })),
  ];

  return (
    <div className="w-full sm:max-w-xs">
      <label
        htmlFor="locations-state-filter"
        className="mb-1 block text-sm font-medium text-brand-700"
      >
        Filter by state
      </label>
      <Select
        id="locations-state-filter"
        value={stateFilter}
        onChange={(e) => onStateChange(e.target.value)}
        options={stateOptions}
        aria-label="Filter by state"
      />
    </div>
  );
}
