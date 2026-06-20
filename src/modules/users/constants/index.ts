import type { EmdAmountOperator } from "@/modules/users/types";

export type IndianStateValue =
  | "Maharashtra"
  | "Bihar"
  | "Chhattisgarh"
  | "Karnataka"
  | "Manipur"
  | "Arunachal_Pradesh"
  | "Assam"
  | "Gujarat"
  | "Punjab"
  | "Mizoram"
  | "Andhra_Pradesh"
  | "West_Bengal"
  | "Goa"
  | "Haryana"
  | "Himachal_Pradesh"
  | "Kerala"
  | "Rajasthan"
  | "Jharkhand"
  | "Madhya_Pradesh"
  | "Odisha"
  | "Nagaland"
  | "TamilNadu"
  | "Uttar_Pradesh"
  | "Telangana"
  | "Meghalaya"
  | "Sikkim"
  | "Tripura"
  | "Uttarakhand"
  | "Jammu_and_Kashmir"
  | "Delhi"
  | "Lakshadweep"
  | "Puducherry"
  | "Ladakh"
  | "Chandigarh"
  | "Andaman_and_Nicobar_Islands"
  | "Dadra_and_Nagar_Haveli_and_Daman_and_Diu"
  | "PAN_INDIA";

export interface IndianStateOption {
  value: IndianStateValue | string;
  label: string;
  code: string;
}

export const INDIAN_STATES: IndianStateOption[] = [
  { value: "Maharashtra", label: "Maharashtra", code: "MH" },
  { value: "Bihar", label: "Bihar", code: "BR" },
  { value: "Chhattisgarh", label: "Chhattisgarh", code: "CG" },
  { value: "Karnataka", label: "Karnataka", code: "KA" },
  { value: "Manipur", label: "Manipur", code: "MN" },
  { value: "Arunachal_Pradesh", label: "Arunachaal Pradesh", code: "AR" },
  { value: "Assam", label: "Assam", code: "AS" },
  { value: "Gujarat", label: "Gujarat", code: "GJ" },
  { value: "Punjab", label: "Punjab", code: "PB" },
  { value: "Mizoram", label: "Mizoram", code: "MZ" },
  { value: "Andhra_Pradesh", label: "Andhra Pradesh", code: "AP" },
  { value: "West_Bengal", label: "West Bengal", code: "WB" },
  { value: "Goa", label: "Goa", code: "GA" },
  { value: "Haryana", label: "Haryana", code: "HR" },
  { value: "Himachal_Pradesh", label: "Himachal Pradesh", code: "HP" },
  { value: "Kerala", label: "Kerala", code: "KL" },
  { value: "Rajasthan", label: "Rajasthan", code: "RJ" },
  { value: "Jharkhand", label: "Jharkhand", code: "JH" },
  { value: "Madhya_Pradesh", label: "Madhya Pradesh", code: "MP" },
  { value: "Odisha", label: "Odisha", code: "OD" },
  { value: "Nagaland", label: "Nagaland", code: "NL" },
  { value: "TamilNadu", label: "Tamil Nadu", code: "TN" },
  { value: "Uttar_Pradesh", label: "Uttar Pradesh", code: "UP" },
  { value: "Telangana", label: "Telangana", code: "TS" },
  { value: "Meghalaya", label: "Meghalaya", code: "ML" },
  { value: "Sikkim", label: "Sikkim", code: "SK" },
  { value: "Tripura", label: "Tripura", code: "TR" },
  { value: "Uttarakhand", label: "Uttarakhand", code: "UK" },
  { value: "Jammu_and_Kashmir", label: "Jammu and Kashmir", code: "JK" },
  { value: "Delhi", label: "Delhi", code: "DL" },
  { value: "Lakshadweep", label: "Lakshadweep", code: "LD" },
  { value: "Puducherry", label: "Puducherry", code: "PY" },
  { value: "Ladakh", label: "Ladakh", code: "LA" },
  { value: "Chandigarh", label: "Chandigarh", code: "CH" },
  {
    value: "Andaman_and_Nicobar_Islands",
    label: "Andaman & Nicobar",
    code: "AN",
  },
  {
    value: "Dadra_and_Nagar_Haveli_and_Daman_and_Diu",
    label: "DNH & DD",
    code: "DN",
  },
  { value: "PAN_INDIA", label: "PAN INDIA", code: "PI" },
].sort((a, b) => a.label.localeCompare(b.label));

export const USER_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Blocked", value: "blocked" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
] as const;

export const USER_ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Staff", value: "staff" },
  { label: "Accountant", value: "accountant" },
  { label: "Dealer", value: "dealer" },
  { label: "HR", value: "hr" },
] as const;

/** Matches legacy `SeachByRole` filter — HR is excluded from list filter. */
export const USER_ROLE_FILTER_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Staff", value: "staff" },
  { label: "Accountant", value: "accountant" },
  { label: "Dealer", value: "dealer" },
];

/** Matches legacy `paymentsFor` in `constantValues.js`. */
export const PAYMENTS_FOR_OPTIONS = [
  { label: "Registration", value: "registrations" },
  { label: "Emd", value: "emd" },
  { label: "Refund", value: "refund" },
  { label: "Forfeit", value: "forfeit" },
  { label: "Buyer Fees", value: "buyer_fees" },
];

export const EMD_PAYMENT_STATUS_OPTIONS = [
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
] as const;

export const EMD_AMOUNT_OPERATOR_OPTIONS: {
  value: EmdAmountOperator;
  label: string;
}[] = [
  { value: "gt", label: "Greater than" },
  { value: "gte", label: "Greater than or equal" },
  { value: "lt", label: "Less than" },
  { value: "lte", label: "Less than or equal" },
  { value: "equals", label: "Equals" },
];

export const ALLOWED_USER_ROLES = new Set([
  "admin",
  "staff",
  "accountant",
  "dealer",
  "hr",
]);

export const USERS_PAGE_SIZE = 10;
