/** In-app user-related routes migrated to Next.js. */
export const USER_ROUTES = {
  bids: (userId: string) => `/bids-user/${userId}`,
  payments: (userId: string) => `/payment/${userId}`,
  createPayment: (userId: string) => `/create-payment/${userId}`,
  blockedSellers: (userId: string) => `/blocked-sellers/${userId}`,
  notifications: (userId: string) => `/user-notifications/${userId}`,
} as const;

/** Drill-down routes for user-related pages not yet migrated to Next.js. */
export const USER_LEGACY_ROUTES = {
  buyingLimit: (userId: string) => `/buying-limit/${userId}`,
  staffCreatedUsers: (userId: string) => `/staff-created-users/${userId}`,
  termsCondition: (userId: string) => `/user-terms-condition/${userId}`,
} as const;

export const IDENTITY_IMAGE_KEYS = [
  "pancard_image",
  "aadharcard_front_image",
  "aadharcard_back_image",
  "driving_license_front_image",
  "driving_license_back_image",
] as const;

export type IdentityImageKey = (typeof IDENTITY_IMAGE_KEYS)[number];

export const IDENTITY_IMAGE_LABELS: Record<IdentityImageKey, string> = {
  pancard_image: "Pancard",
  aadharcard_front_image: "ID Proof front",
  aadharcard_back_image: "ID Proof Back",
  driving_license_front_image: "License Front",
  driving_license_back_image: "License Back",
};
