"use client";

import { FormField } from "@/components/forms";
import { Select } from "@/components/ui";
import { EVENT_BOT_CATEGORY_OPTIONS } from "@/modules/event-bots/constants/filter-options";
import type { EventCategory } from "@/modules/events/types";
import type { EventFilterOption } from "@/modules/events/types";
import { cn } from "@/lib/utils";

export interface EventBotsFilterFieldsProps {
  sellerId: string;
  setSellerId: (value: string) => void;
  eventCategory: EventCategory | "";
  setEventCategory: (value: EventCategory | "") => void;
  startDate: string;
  setStartDate: (value: string) => void;
  sellerOptions: EventFilterOption[];
  layout?: "grid" | "stack";
}

export function EventBotsFilterFields({
  sellerId,
  setSellerId,
  eventCategory,
  setEventCategory,
  startDate,
  setStartDate,
  sellerOptions,
  layout = "grid",
}: EventBotsFilterFieldsProps) {
  const isStacked = layout === "stack";

  return (
    <div className={cn(isStacked ? "flex flex-col gap-4" : "contents")}>
      <FormField label="Seller" htmlFor="eventbots-seller">
        <Select
          id="eventbots-seller"
          placeholder="All sellers"
          options={sellerOptions}
          value={sellerId}
          onChange={(e) => setSellerId(e.target.value)}
        />
      </FormField>

      <FormField label="Event Category" htmlFor="eventbots-category">
        <Select
          id="eventbots-category"
          placeholder="All categories"
          options={[...EVENT_BOT_CATEGORY_OPTIONS]}
          value={eventCategory}
          onChange={(e) => setEventCategory(e.target.value as EventCategory | "")}
        />
      </FormField>

      <FormField label="Start Date" htmlFor="eventbots-start-date">
        <input
          id="eventbots-start-date"
          type="date"
          className="h-10 w-full rounded-md border border-surface-border px-3 text-sm"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </FormField>
    </div>
  );
}
