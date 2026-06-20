/** Drill-down routes for event pages not yet migrated to Next.js. */
export const EVENT_LEGACY_ROUTES = {
  addEvent: "/addevent",
  editEvent: (eventId: string) => `/edit-event/${eventId}`,
  viewVehicles: (eventId: string, category: string) =>
    `/view-vehicls/${eventId}?category=${category}`,
  addVehicle: (eventId: string) => `/add-vehicle/${eventId}`,
  deletedVehicles: (eventId: string) => `/Deleted-vehicles/${eventId}`,
  uploadVehicles: (eventId: string, category: string) =>
    `/upload-excel/${eventId}/upload?category=${category}`,
  updateVehicles: (eventId: string) => `/upload-excel/${eventId}/update`,
  uploadImages: (eventId: string) => `/upload-excel/${eventId}/images`,
  uploadZip: (eventId: string) => `/upload-excel/${eventId}/zip`,
  createdByUser: (userId: string) => `/view-user/${userId}`,
  eventTermsUsers: (eventId: string) => `/event-terms-users/${eventId}`,
} as const;
