export const PAYMENTS_PAGE_SIZE = 10;

export const PAYMENT_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
] as const;

export const PAYMENT_STATUS_FILTER_OPTIONS = [
  { label: "All statuses", value: "" },
  ...PAYMENT_STATUS_OPTIONS,
];

export const PAYMENT_FOR_FILTER_OPTIONS = [
  { label: "All payment types", value: "" },
  { label: "Registration", value: "registrations" },
  { label: "Emd", value: "emd" },
  { label: "Refund", value: "refund" },
  { label: "Forfeit", value: "forfeit" },
  { label: "Buyer Fees", value: "buyer_fees" },
];

export const EMD_ADJUSTMENT_OPTIONS = [
  { label: "Increment", value: "Increment" },
  { label: "Decrement", value: "Decrement" },
] as const;

export const MAX_PAYMENT_AMOUNT_DIGITS = 8;
export const MAX_PAYMENT_IMAGE_BYTES = 1 * 1024 * 1024;
