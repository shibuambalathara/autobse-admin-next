export type EventCategory = "open" | "online" | "auctionReport";

export type EventStatusType = "active" | "inactive";

export type MetaEventType = string;

export interface EventListItem {
  id: string;
  eventNo: number;
  eventCategory: string;
  metaEventId?: number | null;
  metaEventType?: MetaEventType | null;
  startDate: string;
  endDate: string;
  status?: string | null;
  bidLock?: string | null;
  createdAt?: string | null;
  createdById?: string | null;
  vehiclesCount?: number | null;
  deletedVehiclesCount?: number | null;
  vehicleCategory?: { name?: string | null } | null;
  seller?: { id: string; name?: string | null } | null;
  location?: { id: string; name?: string | null } | null;
}

export interface EventWhereUniqueInput {
  startDate?: string;
  eventCategory?: EventCategory;
  status?: EventStatusType;
  locationId?: string;
  sellerId?: string;
  vehicleCategoryId?: string;
}

export interface NewEventsListingVariables {
  where?: EventWhereUniqueInput;
  search?: string;
  take?: number;
  skip?: number;
  orderBy?: Array<Record<string, "ASC" | "DESC">>;
}

export interface NewEventsListingResult {
  eventsData: {
    eventCount: number;
    events?: EventListItem[] | null;
  };
}

export interface LocationOption {
  id: string;
  name: string;
}

export interface SellerOption {
  id: string;
  name: string;
}

export interface VehicleCategoryOption {
  id: string;
  name: string;
}

export interface LocationsFilterResult {
  locations: {
    locations: LocationOption[];
  };
}

export interface SellersFilterResult {
  sellers: SellerOption[];
}

export interface VehicleCategoriesResult {
  vehicleCategories: VehicleCategoryOption[];
}

export interface EventFilterOption {
  value: string;
  label: string;
}
