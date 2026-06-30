export interface PaymentUser {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  mobile?: string | null;
  username?: string | null;
  vehicleBuyingLimit?: number | null;
}

export interface PaymentEmdUpdateRef {
  id?: string;
  vehicleBuyingLimitIncrement?: number | null;
}

export interface PaymentListItem {
  id: string;
  refNo?: number | null;
  amount?: number | null;
  description?: string | null;
  paymentCount?: number | null;
  status?: string | null;
  userId?: string | null;
  image?: string | { url?: string | null } | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdById?: string | null;
  registrationExpire?: string | null;
  paymentFor?: string | null;
  user?: PaymentUser | null;
  emdUpdate?: PaymentEmdUpdateRef[] | null;
  createdBy?: { firstName?: string | null } | null;
}

export interface PaymentStatusHistoryItem {
  id?: string | null;
  status?: string | null;
  comment?: string | null;
  createdAt?: string | null;
  createdById?: string | null;
  createdBy?: { firstName?: string | null } | null;
}

export interface EmdUpdateRow {
  id: string;
  emdNo?: number | null;
  vehicleBuyingLimitIncrement?: number | null;
  createdAt?: string | null;
  createdById?: string | null;
  createdBy?: { id?: string; firstName?: string | null } | null;
  payment?: { id?: string; amount?: number | null } | null;
}

export interface PaymentDetail {
  id: string;
  refNo?: number | null;
  amount?: number | null;
  description?: string | null;
  status?: string | null;
  userId?: string | null;
  image?: string | { url?: string | null } | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdById?: string | null;
  registrationExpire?: string | null;
  paymentFor?: string | null;
  user?: PaymentUser | null;
}

export interface PaymentsListResponse {
  paymentsCount?: number | null;
  payments: PaymentListItem[];
}
