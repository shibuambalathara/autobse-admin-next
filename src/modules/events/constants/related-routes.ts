import { ROUTES } from "@/constants/routes";

/** In-app event-related routes migrated to Next.js. */
export const EVENT_ROUTES = {
  addVehicle: (eventId: string) => ROUTES.vehicleAdd(eventId),
  deletedVehicles: (eventId: string) => ROUTES.deletedVehicles(eventId),
  uploadVehicles: (eventId: string, category?: string) =>
    ROUTES.eventUploadExcel(eventId, "upload", category),
  updateVehicles: (eventId: string) =>
    ROUTES.eventUploadExcel(eventId, "update"),
  uploadImages: (eventId: string) =>
    ROUTES.eventUploadExcel(eventId, "images"),
  uploadZip: (eventId: string) => ROUTES.eventUploadExcel(eventId, "zip"),
  createdByUser: (userId: string) => ROUTES.userDetail(userId),
  eventTermsUsers: (eventId: string) => ROUTES.eventTermsUsers(eventId),
} as const;

/** Drill-down routes for event pages not yet migrated to Next.js. */
export const EVENT_LEGACY_ROUTES = {
  addEvent: "/events/add",
  editEvent: (eventId: string) => `/events/${eventId}/edit`,
  viewVehicles: (eventId: string, category: string) =>
    `/view-vehicls/${eventId}?category=${category}`,
} as const;
