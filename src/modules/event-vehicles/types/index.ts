export interface EventVehiclesHeader {
  id: string;
  eventNo: number;
  eventCategory: string;
  endDate: string;
  bidLock?: string | null;
  seller?: { name?: string | null } | null;
  location?: { name?: string | null } | null;
}

export interface EventVehiclesHeaderResult {
  event: EventVehiclesHeader;
}

export interface EventVehicleListItem {
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
  images?: string[] | null;
  currentBidAmount?: number | null;
  startPrice?: number | null;
  quoteIncreament?: number | null;
  currentBidUser?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  event?: {
    seller?: { name?: string | null } | null;
  } | null;
}

export interface VehiclesListResult {
  vehicles: {
    vehiclesCount: number;
    vehicles: EventVehicleListItem[];
  };
}

export interface VehiclesListVariables {
  orderBy?: Array<Record<string, "ASC" | "DESC">>;
  take?: number;
  skip?: number;
  search?: string;
  where?: {
    event?: { id: string };
  };
}
