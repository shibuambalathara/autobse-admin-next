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
  usersOtpUnverified: "/users/otp-unverified",
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
  sellersAdd: "/sellers/add",
  sellerEdit: (id: string) => `/sellers/${id}/edit` as const,
  blockedDealers: "/blocked-dealers",
  blockedDealersBySeller: (sellerId: string) =>
    `/blocked-dealers/${sellerId}` as const,
  blockedSellersByUser: (userId: string) => `/blocked-sellers/${userId}` as const,
  locations: "/locations",
  states: "/states",
  proVahan: "/pro-vahan",
  whatsapp: "/whatsapp",
  whatsappResponses: "/whatsapp/responses",
  whatsappDeleted: "/whatsapp/deleted",
  splitExcel: "/split-excel",
  vehicleImages: "/vehicle-images",
  pdfImageExtract: "/pdf-image-extract",
  archiveEvents: "/archive-events",
  archiveEventVehicles: (
    id: string,
    params?: { eventNo?: number | null; sellerName?: string }
  ) => {
    const search = new URLSearchParams();
    if (params?.eventNo != null) search.set("eventNo", String(params.eventNo));
    if (params?.sellerName) search.set("sellerName", params.sellerName);
    const query = search.toString();
    return query
      ? (`/archive-events/${id}/vehicles?${query}` as const)
      : (`/archive-events/${id}/vehicles` as const);
  },
  archiveEventTerms: (
    id: string,
    params?: { eventNo?: number | null; sellerName?: string }
  ) => {
    const search = new URLSearchParams();
    if (params?.eventNo != null) search.set("eventNo", String(params.eventNo));
    if (params?.sellerName) search.set("sellerName", params.sellerName);
    const query = search.toString();
    return query
      ? (`/archive-events/${id}/terms?${query}` as const)
      : (`/archive-events/${id}/terms` as const);
  },
  notifications: "/notifications",
  notificationsDeleted: "/notifications/deleted",
  userNotifications: (userId: string) => `/user-notifications/${userId}` as const,
  userNotificationsDeleted: (userId: string) =>
    `/user-notifications/${userId}/deleted` as const,
  enquiries: "/enquiries",
  blog: "/blog",
  blogAdd: "/blog/add",
  blogEdit: (id: string) => `/blog/${id}/edit` as const,
  blogsDeleted: "/blog/deleted",
  career: "/career",
  careerAdd: "/career/add",
  careerEdit: (id: string) => `/career/${id}/edit` as const,
  careersDeleted: "/career/deleted",
  careerApplications: (careerId: string) =>
    `/career/${careerId}/applications` as const,
  jobs: "/jobs",
  jobApplicationDetail: (id: string) => `/jobs/${id}` as const,
  scheduleCalls: "/schedule-calls",
  scheduleCallsDeleted: "/schedule-calls/deleted",
  auditLogs: "/audit-logs",
  userAuditLogs: (userId: string) => `/user-audit-logs/${userId}` as const,
  settings: "/settings",
  components: "/components",
  accountRecovery: "/account-recovery",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
