export const EVENT_VEHICLES_PAGE_SIZE = 10;

export const VEHICLE_LEGACY_ROUTES = {
  editVehicle: (vehicleId: string) => `/edit-vehicle/${vehicleId}`,
  bidDetails: (vehicleId: string) => `/bid-details/${vehicleId}`,
  vehicleStatusHistory: (vehicleId: string) =>
    `/ViewVehicleStatusHistory/search?type=vehicle&id=${vehicleId}`,
  openAuctionBid: (vehicleId: string) => `/openAuction-bid/${vehicleId}`,
  addVehicle: (eventId: string) => `/add-vehicle/${eventId}`,
  deletedVehicles: (eventId: string) => `/Deleted-vehicles/${eventId}`,
  deletedBids: (eventId: string) => `/deleted-bids/${eventId}`,
} as const;
