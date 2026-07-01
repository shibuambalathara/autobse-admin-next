export interface ArchivedEvent {
  id: string;
  eventCategory?: string | null;
  archivedAt?: string | null;
  endDate?: string | null;
  startDate?: string | null;
  eventNo?: number | null;
  vehiclesCount?: number | null;
  sellerId?: string | null;
  locationId?: string | null;
  vehicleCategoryId?: string | null;
  archivedBy?: { id: string } | null;
}

export interface ArchiveEventsResult {
  eventArchived: {
    eventArchiveCount: number;
    eventArchived?: ArchivedEvent[] | null;
  };
}

export interface EventArchiveWhereInput {
  sellerId?: string;
  locationId?: string;
}

export interface ArchiveEventsQueryVariables {
  orderBy?: Array<{ archivedAt?: "ASC" | "DESC" }>;
  take?: number;
  skip?: number;
  search?: string;
  where?: EventArchiveWhereInput;
}

export interface AcrArchiveResult {
  getAcrArchive?: Array<Record<string, unknown>> | null;
}

export interface ArchivedVehicle {
  id: string;
  lotNumber?: number | null;
  loanAgreementNo?: string | null;
  vehicleIndexNo?: number | null;
  registrationNumber?: string | null;
  model?: string | null;
  bidStatus?: string | null;
  bidStartTime?: string | null;
  bidTimeExpire?: string | null;
  totalBids?: number | null;
  currentBidAmount?: number | null;
  createdAt?: string | null;
  currentBidUser?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;
}

export interface ArchiveVehiclesResult {
  vehiclesArchive: {
    vehiclesCount: number;
    vehicles: ArchivedVehicle[];
  };
}

export interface ArchivedVehicleDetail {
  id: string;
  bidStatus?: string | null;
  registrationNumber?: string | null;
  loanAgreementNo?: string | null;
  repoDt?: string | null;
  make?: string | null;
  model?: string | null;
  varient?: string | null;
  lotNumber?: number | null;
  fuel?: string | null;
  rcStatus?: string | null;
  ownership?: number | null;
  kmReading?: number | null;
  insuranceStatus?: string | null;
  startPrice?: number | null;
  reservePrice?: number | null;
  city?: string | null;
  state?: string | null;
  area?: string | null;
  paymentTerms?: string | null;
  dateOfRegistration?: string | null;
  vehicleCondition?: string | null;
  chassisNo?: string | null;
  YOM?: number | null;
  quoteIncreament?: number | null;
  inspectionLink?: string | null;
  yardLocation?: string | null;
  image?: string | null;
  registeredOwnerName?: string | null;
  currentBidAmount?: number | null;
  startBidAmount?: number | null;
  bidStartTime?: string | null;
  bidTimeExpire?: string | null;
  totalBids?: number | null;
  createdAt?: string | null;
  event?: {
    id?: string | null;
    eventNo?: number | null;
  } | null;
}

export interface ArchiveVehicleDetailResult {
  vehiclesArchive: {
    vehicles: ArchivedVehicleDetail[];
  };
}

export interface ArchiveTermsRow {
  id: string;
  userId: string;
  archivedAt?: string | null;
  archivedById?: string | null;
  eventArchiveId: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ArchiveTermsResult {
  termsAndConditionsArchive: {
    termsAndConditionsArchiveCount?: number | null;
    termsAndConditionsArchive: ArchiveTermsRow[];
  };
}

export const ARCHIVE_EVENTS_PAGE_SIZE = 10;
export const ARCHIVE_VEHICLES_PAGE_SIZE = 10;
