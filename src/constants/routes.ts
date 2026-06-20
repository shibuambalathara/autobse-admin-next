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
  eventsTypes: "/events/types",
  auctions: "/auctions",
  auctionsFind: "/auctions/find",
  vehicles: "/vehicles",
  sellers: "/sellers",
  payments: "/payments",
  locations: "/locations",
  notifications: "/notifications",
  enquiries: "/enquiries",
  settings: "/settings",
  components: "/components",
  accountRecovery: "/account-recovery",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
