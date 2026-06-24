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
  image?: string | null;
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
