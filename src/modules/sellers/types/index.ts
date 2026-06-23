export interface Seller {
  id: string;
  name: string;
  contactPerson?: string | null;
  GSTNumber?: string | null;
  billingContactPerson?: string | null;
  mobile?: string | null;
  nationalHead?: string | null;
  logo?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdById?: string | null;
}

export interface SellerOption {
  id: string;
  name: string;
}

export interface SellersListResult {
  sellers: Seller[];
}

export interface SellerDetailResult {
  seller: Seller | null;
}

export interface CreateSellerInput {
  name: string;
  GSTNumber?: string;
  billingContactPerson?: string;
  contactPerson?: string;
  mobile?: string;
  nationalHead?: string;
  logo?: string;
}

export interface UpdateSellerInput {
  name?: string;
  GSTNumber?: string;
  billingContactPerson?: string;
  contactPerson?: string;
  mobile?: string;
  nationalHead?: string;
  logo?: string;
}

export interface CreateSellerFormValues {
  sellerCompanyName: string;
  gst?: string;
  billingContactPerson?: string;
  contactPerson?: string;
  mobile?: string;
  nationalHead?: string;
}

export interface EditSellerFormValues {
  sellerCompanyName: string;
  contactPerson?: string;
  GSTNumber?: string;
  mobile?: string;
  nationalHead?: string;
  billingContactPerson?: string;
  logo?: string;
}

export interface SellerAcrByEndDateResult {
  getAcrBySellerAndEndDate: Record<string, unknown>[] | null;
}
