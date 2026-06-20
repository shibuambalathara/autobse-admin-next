import { EVENT_CATEGORY_OPTIONS } from "@/modules/events/constants";

export const EVENT_BOT_CATEGORY_OPTIONS = EVENT_CATEGORY_OPTIONS.filter(
  (option) => option.value !== "auctionReport"
);
