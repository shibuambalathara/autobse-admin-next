import type {
  AuditChangedByRole,
  AuditEntityType,
} from "@/modules/audit-logs/types";

export const AUDIT_LOGS_PAGE_SIZE = 10;

export const AUDIT_ENTITY_TYPE_OPTIONS: {
  label: string;
  value: AuditEntityType;
}[] = [
  { label: "ACR", value: "ACR" },
  { label: "Bid", value: "BID" },
  { label: "Blocked Dealer", value: "BLOCKED_DEALER" },
  { label: "Blog", value: "BLOG" },
  { label: "Calendar", value: "CALENDAR" },
  { label: "Career", value: "CAREER" },
  { label: "EMD Update", value: "EMD_UPDATE" },
  { label: "Enquiry", value: "ENQUIRY" },
  { label: "Event", value: "EVENT" },
  { label: "Excel Upload", value: "EXCEL_UPLOAD" },
  { label: "Find Auction", value: "FIND_AUCTION" },
  { label: "Institution", value: "INSTITUTION" },
  { label: "Job Application", value: "JOB_APPLICATION" },
  { label: "Location", value: "LOCATION" },
  { label: "Notification", value: "NOTIFICATION" },
  { label: "Payment", value: "PAYMENT" },
  { label: "Payment Status", value: "PAYMENT_STATUS" },
  { label: "Seller", value: "SELLER" },
  { label: "State", value: "STATE" },
  { label: "Terms & Condition", value: "TERMS_AND_CONDITION" },
  { label: "User", value: "USER" },
  { label: "Vehicle", value: "VEHICLE" },
  { label: "Vehicle Category", value: "VEHICLE_CATEGORY" },
  { label: "Vehicle Status", value: "VEHICLE_STATUS" },
];

export const AUDIT_CHANGED_BY_ROLE_OPTIONS: {
  label: string;
  value: AuditChangedByRole;
}[] = [
  { label: "Accountant", value: "accountant" },
  { label: "Admin", value: "admin" },
  { label: "Dealer", value: "dealer" },
  { label: "HR", value: "hr" },
  { label: "Seller", value: "seller" },
  { label: "Staff", value: "staff" },
];

export function formatAuditEntityType(value?: string | null): string {
  if (!value) return "—";
  const match = AUDIT_ENTITY_TYPE_OPTIONS.find((option) => option.value === value);
  return match?.label ?? value.replace(/_/g, " ");
}
