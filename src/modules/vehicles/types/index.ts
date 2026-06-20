export interface VehicleDetail {
  id: string;
  additionalData?: Record<string, unknown> | string | null;
  vehicleIndexNo?: number | null;
  registrationNumber?: string | null;
  loanAgreementNo?: string | null;
  make?: string | null;
  model?: string | null;
  varient?: string | null;
  rcStatus?: string | null;
  YOM?: number | null;
  ownership?: number | null;
  quoteIncreament?: number | null;
  kmReading?: number | null;
  startPrice?: number | null;
  reservePrice?: number | null;
  repoDt?: string | null;
  inspectionLink?: string | null;
  image?: string | null;
  bidStatus?: string | null;
  autobseContact?: string | null;
  autobse_contact_person?: string | null;
  vehicleCondition?: string | null;
  shape?: string | null;
  color?: string | null;
  state?: string | null;
  city?: string | null;
  area?: string | null;
  paymentTerms?: string | null;
  dateOfRegistration?: string | null;
  accidentalStatus?: string | null;
  vehicleKeyStatus?: string | null;
  hypothication?: string | null;
  climateControl?: string | null;
  doorCount?: number | null;
  gearBox?: string | null;
  buyerFees?: number | null;
  rtoFine?: number | null;
  clientContactPerson?: string | null;
  clientContactNo?: string | null;
  additionalRemarks?: string | null;
  lotNumber?: number | null;
  event?: {
    id: string;
    seller?: { name?: string | null } | null;
  } | null;
}

export interface CreateVehicleInput {
  registrationNumber?: string;
  loanAgreementNo?: string;
  make?: string;
  model?: string;
  varient?: string;
  startPrice?: number;
  inspectionLink?: string;
  image?: string;
  repoDt?: string;
  reservePrice?: number;
  kmReading?: number;
  ownership?: number;
  YOM?: number;
  rcStatus?: string;
  quoteIncreament?: number;
  [key: string]: string | number | undefined;
}

export interface DeletedVehicleListItem {
  id: string;
  lotNumber?: number | null;
  loanAgreementNo?: string | null;
  vehicleIndexNo?: number | null;
  registrationNumber?: string | null;
  bidStatus?: string | null;
  totalBids?: number | null;
  event?: {
    eventNo?: number | null;
    seller?: { name?: string | null } | null;
  } | null;
}

export interface VehicleStatusHistoryItem {
  id: string;
  status?: string | null;
  createdAt?: string | null;
  createdBy?: { firstName?: string | null } | null;
}

export interface AdditionalDataFormState {
  keyRenames: Record<string, string>;
  removedFields: Set<string>;
  newFields: Array<{ id: string; key: string; value: string }>;
}
