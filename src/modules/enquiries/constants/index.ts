import type { EnquiryStatus } from "@/modules/enquiries/types";

export const ENQUIRIES_PAGE_SIZE = 10;

export const ENQUIRY_STATUS_OPTIONS: {
  label: string;
  value: EnquiryStatus;
}[] = [
  { label: "Created", value: "created" },
  { label: "Solved", value: "solved" },
];
