import { ROUTES } from "@/constants/routes";

export const EVENT_VEHICLES_PAGE_SIZE = 10;

/** In-app vehicle routes (migrated from legacy CRA paths). */
export const VEHICLE_ROUTES = {
  editVehicle: (vehicleId: string) => ROUTES.vehicleEdit(vehicleId),
  addVehicle: (eventId: string) => ROUTES.vehicleAdd(eventId),
  deletedVehicles: (eventId: string) => ROUTES.deletedVehicles(eventId),
  vehicleStatusHistory: (vehicleId: string) => ROUTES.vehicleStatusHistory(vehicleId),
  bidDetails: (vehicleId: string) => ROUTES.bidDetails(vehicleId),
  deletedBids: (eventId: string) => ROUTES.deletedBids(eventId),
  openAuctionBid: (vehicleId: string) => ROUTES.openAuctionBid(vehicleId),
} as const;

/** Routes not yet migrated to Next.js. */
export const VEHICLE_LEGACY_ROUTES = {} as const;
