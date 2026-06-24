export const WHATSAPP_PAGE_SIZE = 10;

export const DEALER_PROMOTION_TEMPLATE = "dealer_invitation";
export const APPROVED_VEHICLE_TEMPLATE = "approved_vehicle_notification";

export const WHATSAPP_TEMPLATE_OPTIONS = [
  { value: "open_auction_without_excels", label: "Open auction without excel" },
  { value: "open_auction_with_excel", label: "Open auction with excel" },
  { value: "online_auction_without_excels", label: "Online auction without excel" },
  { value: DEALER_PROMOTION_TEMPLATE, label: "Dealer invitation (Excel promotion)" },
  {
    value: APPROVED_VEHICLE_TEMPLATE,
    label: "Approved vehicle notification",
  },
] as const;

export const WHATSAPP_STATUS_OPTIONS = [
  { label: "Sent", value: "sent" },
  { label: "Responded", value: "responded" },
  { label: "Failed", value: "failed" },
] as const;

export type WhatsappTemplateValue =
  (typeof WHATSAPP_TEMPLATE_OPTIONS)[number]["value"];

export type WhatsappStatusValue =
  (typeof WHATSAPP_STATUS_OPTIONS)[number]["value"];
