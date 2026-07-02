"use client";

import { Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import type { EventFilterOption } from "@/modules/events/types";

interface ArchiveEventsFilterFieldsProps {
  locationId: string;
  sellerId: string;
  locationOptions: EventFilterOption[];
  sellerOptions: EventFilterOption[];
  onLocationChange: (value: string) => void;
  onSellerChange: (value: string) => void;
  layout?: "inline" | "stack";
}

export function ArchiveEventsFilterFields({
  locationId,
  sellerId,
  locationOptions,
  sellerOptions,
  onLocationChange,
  onSellerChange,
  layout = "inline",
}: ArchiveEventsFilterFieldsProps) {
  const gridClass =
    layout === "stack"
      ? "grid grid-cols-1 gap-4"
      : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={gridClass}>
      <FormField label="Location" htmlFor="archive-events-location">
        <Select
          id="archive-events-location"
          placeholder="All locations"
          options={locationOptions}
          value={locationId}
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </FormField>

      <FormField label="Seller" htmlFor="archive-events-seller">
        <Select
          id="archive-events-seller"
          placeholder="All sellers"
          options={sellerOptions}
          value={sellerId}
          onChange={(e) => onSellerChange(e.target.value)}
        />
      </FormField>
    </div>
  );
}
 