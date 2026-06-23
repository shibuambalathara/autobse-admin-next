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

export const CALL_STATUS_OPTIONS = [
  { value: CallStatus.Connected, label: "Connected" },
  { value: CallStatus.NotConnected, label: "Not Connected" },
  { value: CallStatus.SwitchedOff, label: "Switched Off" },
  { value: CallStatus.Busy, label: "Busy" },
  { value: CallStatus.NoAnswer, label: "No Answer" },
  { value: CallStatus.InvalidNumber, label: "Invalid Number" },
  { value: CallStatus.CallbackRequested, label: "Callback Requested" },
  { value: CallStatus.FollowUpRequired, label: "Follow Up Required" },
  { value: CallStatus.Interested, label: "Interested" },
  { value: CallStatus.NotInterested, label: "Not Interested" },
  { value: CallStatus.RegisteredBuyer, label: "Registered Buyer" },
] as const;

export const STAFF_USERS_QUERY_VARIABLES = {
  take: 500,
  orderBy: [{ firstName: "ASC" as const }],
  where: { role: "staff", status: "active" },
};
