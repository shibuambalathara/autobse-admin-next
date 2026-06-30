export type EventCategory = "open" | "online" | "auctionReport";

export type EventStatusType = "active" | "inactive";

export type MetaEventType = "CLOSED" | "OPEN";

export interface CreateEventInput {
  eventCategory: EventCategory;
  startDate: string;
  endDate: string;
  noOfBids: number;
  status: string;
  termsAndConditions: string;
  bidLock: string;
  isSpecialEvent?: boolean;
  extraTimeTrigerIn: number;
  extraTime: number;
  vehicleLiveTimeIn?: number;
  gapInBetweenVehicles: number;
  metaEventId?: number | null;
  autobseContactPerson?: string;
  autobseContact?: string;
  metaEventType?: MetaEventType | null;
}

export interface CreateEventResult {
  createEvent: {
    id: string;
    metaEventType?: MetaEventType | null;
  };
}

export interface EventIdWhereInput {
  id: string;
}

export interface EventDetail {
  id: string;
  eventNo: number;
  eventCategory: EventCategory;
  metaEventType?: MetaEventType | null;
  startDate: string;
  endDate: string;
  firstVehicleEndDate?: string | null;
  pauseDate?: string | null;
  pausedTotalTime?: number | null;
  sellerId: string;
  vehicleCategoryId: string;
  locationId: string;
  noOfBids: number;
  downloadableFile_filename?: string | null;
  termsAndConditions: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdById?: string | null;
  extraTimeTrigerIn?: number | null;
  extraTime?: number | null;
  vehicleLiveTimeIn?: number | null;
  gapInBetweenVehicles?: number | null;
  status?: string | null;
  bidLock?: string | null;
  autobseContactPerson?: string | null;
  autobseContact?: string | null;
  vehiclesCount?: number | null;
  metaEventId?: number | null;
  seller?: { id: string; name?: string | null } | null;
  location?: { id: string; name?: string | null } | null;
  vehicleCategory?: { id: string; name?: string | null } | null;
}

export interface SingleEventResult {
  event: EventDetail;
}

export interface EventByIdResult {
  eventsData: {
    events: EventDetail[];
  };
}

export interface UpdateEventInput {
  eventCategory?: EventCategory;
  startDate?: string;
  endDate?: string;
  noOfBids?: number;
  sellerId?: string;
  vehicleCategoryId?: string;
  locationId?: string;
  status?: string;
  termsAndConditions?: string;
  bidLock?: string;
  metaEventId?: number | null;
  autobseContactPerson?: string;
  autobseContact?: string;
  metaEventType?: MetaEventType | null;
}

export interface UpdateEventResult {
  updateEvent: {
    id: string;
    eventNo: number;
  };
}

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
