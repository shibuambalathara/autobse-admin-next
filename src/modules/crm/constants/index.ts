export const CRM_PAGE_SIZE = 10;

export enum BuyerPreference {
  Online = "ONLINE",
  Open = "OPEN",
  Both = "BOTH",
}

export enum PotentialClientStatus {
  New = "NEW",
  Contacted = "CONTACTED",
  FollowUp = "FOLLOW_UP",
  Interested = "INTERESTED",
  NotInterested = "NOT_INTERESTED",
  CallbackRequested = "CALLBACK_REQUESTED",
  Registered = "REGISTERED",
  Closed = "CLOSED",
}

export enum CallStatus {
  Connected = "CONNECTED",
  NotConnected = "NOT_CONNECTED",
  SwitchedOff = "SWITCHED_OFF",
  Busy = "BUSY",
  NoAnswer = "NO_ANSWER",
  InvalidNumber = "INVALID_NUMBER",
  CallbackRequested = "CALLBACK_REQUESTED",
  FollowUpRequired = "FOLLOW_UP_REQUIRED",
  Interested = "INTERESTED",
  NotInterested = "NOT_INTERESTED",
  RegisteredBuyer = "REGISTERED_BUYER",
}

export const BUYER_PREFERENCE_OPTIONS = [
  { value: BuyerPreference.Online, label: "Online" },
  { value: BuyerPreference.Open, label: "Open" },
  { value: BuyerPreference.Both, label: "Both" },
] as const;

export const IS_REGISTERED_BUYER_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
] as const;

export const POTENTIAL_CLIENT_STATUS_OPTIONS = [
  { value: PotentialClientStatus.New, label: "New" },
  { value: PotentialClientStatus.Contacted, label: "Contacted" },
  { value: PotentialClientStatus.FollowUp, label: "Follow Up" },
  { value: PotentialClientStatus.Interested, label: "Interested" },
  { value: PotentialClientStatus.NotInterested, label: "Not Interested" },
  { value: PotentialClientStatus.CallbackRequested, label: "Callback Requested" },
  { value: PotentialClientStatus.Registered, label: "Registered" },
  { value: PotentialClientStatus.Closed, label: "Closed" },
] as const;

export const CALL_STATUS_LABEL_MAP: Record<string, string> = {
  [CallStatus.Connected]: "Connected",
  [CallStatus.NotConnected]: "Not Connected",
  [CallStatus.SwitchedOff]: "Switched Off",
  [CallStatus.Busy]: "Busy",
  [CallStatus.NoAnswer]: "No Answer",
  [CallStatus.InvalidNumber]: "Invalid Number",
  [CallStatus.CallbackRequested]: "Callback Requested",
  [CallStatus.FollowUpRequired]: "Follow Up Required",
  [CallStatus.Interested]: "Interested",
  [CallStatus.NotInterested]: "Not Interested",
  [CallStatus.RegisteredBuyer]: "Registered Buyer",
};

/** UI options exclude Busy and No Answer; labels still resolve for historical rows. */
export const CALL_STATUS_OPTIONS = [
  { value: CallStatus.Connected, label: CALL_STATUS_LABEL_MAP[CallStatus.Connected] },
  { value: CallStatus.NotConnected, label: CALL_STATUS_LABEL_MAP[CallStatus.NotConnected] },
  { value: CallStatus.SwitchedOff, label: CALL_STATUS_LABEL_MAP[CallStatus.SwitchedOff] },
  { value: CallStatus.InvalidNumber, label: CALL_STATUS_LABEL_MAP[CallStatus.InvalidNumber] },
  {
    value: CallStatus.CallbackRequested,
    label: CALL_STATUS_LABEL_MAP[CallStatus.CallbackRequested],
  },
  {
    value: CallStatus.FollowUpRequired,
    label: CALL_STATUS_LABEL_MAP[CallStatus.FollowUpRequired],
  },
  { value: CallStatus.Interested, label: CALL_STATUS_LABEL_MAP[CallStatus.Interested] },
  { value: CallStatus.NotInterested, label: CALL_STATUS_LABEL_MAP[CallStatus.NotInterested] },
  {
    value: CallStatus.RegisteredBuyer,
    label: CALL_STATUS_LABEL_MAP[CallStatus.RegisteredBuyer],
  },
] as const;

export const STAFF_USERS_QUERY_VARIABLES = {
  take: 500,
  orderBy: [{ firstName: "ASC" as const }],
  where: { role: "staff", status: "active" },
};
