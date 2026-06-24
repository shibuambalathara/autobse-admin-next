export const REGISTRATION_NUMBER_PATTERN =
  /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{1,4}$/;

export const VAHAN_HIDDEN_FIELDS = [
  "wheelbase",
  "masked_name",
  "body_type",
  "non_use_to",
  "no_cylinders",
  "non_use_from",
  "permanent_address",
  "sleeper_capacity",
  "vehicle_chasi_number",
  "less_info",
] as const;
