"use client";

import { FormField } from "@/components/forms";
import { Select } from "@/components/ui";
import {
  EVENT_CATEGORY_OPTIONS,
  EVENT_STATUS_FILTER_OPTIONS,
} from "@/modules/events/constants";
import type {
  EventCategory,
  EventFilterOption,
  EventStatusType,
} from "@/modules/events/types";
import { cn } from "@/lib/utils";

export interface EventsFilterFieldsProps {
  startDate: string;
  setStartDate: (value: string) => void;
  eventCategory: EventCategory | "";
  setEventCategory: (value: EventCategory | "") => void;
  status: EventStatusType | "";
  setStatus: (value: EventStatusType | "") => void;
  locationId: string;
  setLocationId: (value: string) => void;
  sellerId: string;
  setSellerId: (value: string) => void;
  vehicleCategoryId: string;
  setVehicleCategoryId: (value: string) => void;
  locationOptions: EventFilterOption[];
  sellerOptions: EventFilterOption[];
  vehicleCategoryOptions: EventFilterOption[];
  layout?: "grid" | "stack";
}

export function EventsFilterFields({
  startDate,
  setStartDate,
  eventCategory,
  setEventCategory,
  status,
  setStatus,
  locationId,
  setLocationId,
  sellerId,
  setSellerId,
  vehicleCategoryId,
  setVehicleCategoryId,
  locationOptions,
  sellerOptions,
  vehicleCategoryOptions,
  layout = "grid",
}: EventsFilterFieldsProps) {
  const isStacked = layout === "stack";

  return (
    <div className={cn(isStacked ? "flex flex-col gap-4" : "contents")}>
      <FormField label="Start Date" htmlFor="events-start-date">
        <input
          id="events-start-date"
          type="date"
          className="h-10 w-full rounded-md border border-surface-border px-3 text-sm"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </FormField>

      <FormField label="Event Category" htmlFor="events-category">
        <Select
          id="events-category"
          placeholder="All categories"
          options={[...EVENT_CATEGORY_OPTIONS]}
          value={eventCategory}
          onChange={(e) => setEventCategory(e.target.value as EventCategory | "")}
        />
      </FormField>

      <FormField label="Status" htmlFor="events-status">
        <Select
          id="events-status"
          placeholder="All statuses"
          options={[...EVENT_STATUS_FILTER_OPTIONS]}
          value={status}
          onChange={(e) => setStatus(e.target.value as EventStatusType | "")}
        />
      </FormField>

      <FormField label="Location" htmlFor="events-location">
        <Select
          id="events-location"
          placeholder="All locations"
          options={locationOptions}
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
        />
      </FormField>

      <FormField label="Seller" htmlFor="events-seller">
        <Select
          id="events-seller"
          placeholder="All sellers"
          options={sellerOptions}
          value={sellerId}
          onChange={(e) => setSellerId(e.target.value)}
        />
      </FormField>

      <FormField label="Vehicle Category" htmlFor="events-vehicle-category">
        <Select
          id="events-vehicle-category"
          placeholder="All vehicle categories"
          options={vehicleCategoryOptions}
          value={vehicleCategoryId}
          onChange={(e) => setVehicleCategoryId(e.target.value)}
        />
      </FormField>
    </div>
  );
}
