import type { EventCategory, EventStatusType } from "@/modules/events/types";

export const EVENTS_PAGE_SIZE = 10;

export const EVENT_CATEGORY_OPTIONS: {
  label: string;
  value: EventCategory;
}[] = [
  { label: "Open", value: "open" },
  { label: "Online", value: "online" },
  { label: "Auction", value: "auctionReport" },
];

export const EVENT_STATUS_FILTER_OPTIONS: {
  label: string;
  value: EventStatusType;
}[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];
