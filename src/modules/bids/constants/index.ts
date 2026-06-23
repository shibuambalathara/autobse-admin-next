export const DELETED_BIDS_PAGE_SIZE = 10;

export const VEHICLE_BID_STATUS = {
  DECLINED: "declined",
  FULL_FILLED: "fullFilled",
} as const;

export const INDIAN_STATE_OPTIONS = [
  { value: "MH", label: "Maharashtra (MH)" },
  { value: "KL", label: "Kerala (KL)" },
  { value: "TN", label: "Tamil Nadu (TN)" },
  { value: "KA", label: "Karnataka (KA)" },
  { value: "AP", label: "Andhra Pradesh (AP)" },
  { value: "TS", label: "Telangana (TS)" },
  { value: "DL", label: "Delhi (DL)" },
  { value: "GJ", label: "Gujarat (GJ)" },
  { value: "RJ", label: "Rajasthan (RJ)" },
  { value: "UP", label: "Uttar Pradesh (UP)" },
  { value: "WB", label: "West Bengal (WB)" },
  { value: "HR", label: "Haryana (HR)" },
  { value: "PB", label: "Punjab (PB)" },
  { value: "MP", label: "Madhya Pradesh (MP)" },
  { value: "BR", label: "Bihar (BR)" },
  { value: "PI", label: "PAN INDIA (PI)" },
] as const;
