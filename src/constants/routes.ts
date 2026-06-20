/**
 * Application route paths.
 * Single source of truth for navigation and redirects.
 */
export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  users: "/users",
  usersAdd: "/users/add",
  usersDeleted: "/users/deleted",
  usersPending: "/users/pending",
  userDetail: (id: string) => `/users/${id}` as const,
  events: "/events",
  eventsAdd: "/events/add",
  eventEdit: (id: string) => `/events/${id}/edit` as const,
  eventUploadExcel: (
    eventId: string,
    type: "upload" | "update" | "images" | "zip" | "eventbot",
    category?: string
  ) =>
    category
      ? (`/upload-excel/${eventId}/${type}?category=${category}` as const)
      : (`/upload-excel/${eventId}/${type}` as const),
  eventVehicles: (id: string, category?: string) =>
    category
      ? (`/view-vehicls/${id}?category=${category}` as const)
      : (`/view-vehicls/${id}` as const),
  vehicleAdd: (eventId: string) => `/add-vehicle/${eventId}` as const,
  vehicleEdit: (id: string) => `/edit-vehicle/${id}` as const,
  deletedVehicles: (eventId: string) => `/Deleted-vehicles/${eventId}` as const,
  vehicleStatusHistory: (id: string) => `/vehicle-status-history/${id}` as const,
  bidDetails: (vehicleId: string) => `/bid-details/${vehicleId}` as const,
  deletedBids: (eventId: string) => `/deleted-bids/${eventId}` as const,
  bidsPerUser: (userId: string) => `/bids-user/${userId}` as const,
  bidsArchivePerUser: (userId: string) => `/bids-user/${userId}/archive` as const,
  openAuctionBid: (vehicleId: string) => `/openAuction-bid/${vehicleId}` as const,
  payments: "/payments",
  paymentsCreate: "/payments/create",
  paymentUser: (userId: string) => `/payment/${userId}` as const,
  createPayment: (userId: string) => `/create-payment/${userId}` as const,
  updatePayment: (paymentId: string, userId?: string) =>
    userId
      ? (`/update-payment/${paymentId}?userId=${userId}` as const)
      : (`/update-payment/${paymentId}` as const),
  addEmd: (paymentId: string) => `/add-emd/${paymentId}` as const,
  emdDetails: (paymentId: string) => `/emdDetails/${paymentId}` as const,
  paymentHistory: (paymentId: string) => `/payment-history/${paymentId}` as const,
  eventBots: "/event-bots",
  eventBotsAdd: "/event-bots/add",
  eventBotEdit: (id: string) => `/event-bots/${id}/edit` as const,
  eventBotsDeleted: "/event-bots/deleted",
  eventBotUpload: (eventId: string) =>
    `/upload-excel/${eventId}/eventbot` as const,
  crm: "/crm",
  crmAdd: "/crm/add",
  crmEdit: (id: string) => `/crm/${id}/edit` as const,
  crmDeleted: "/crm/deleted",
  crmUpload: "/crm/upload",
  crmCallLogs: (clientId: string) => `/crm/${clientId}/call-logs` as const,
  crmCallLogAdd: (clientId: string) =>
    `/crm/${clientId}/call-logs/add` as const,
  crmCallLogEdit: (id: string) => `/crm/call-logs/${id}/edit` as const,
  crmCallLogsDeleted: (clientId: string) =>
    `/crm/${clientId}/call-logs/deleted` as const,
  eventsTypes: "/events/types",
  auctions: "/auctions",
  auctionsFind: "/auctions/find",
  vehicles: "/vehicles",
  sellers: "/sellers",
  locations: "/locations",
  notifications: "/notifications",
  enquiries: "/enquiries",
  settings: "/settings",
  components: "/components",
  accountRecovery: "/account-recovery",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
