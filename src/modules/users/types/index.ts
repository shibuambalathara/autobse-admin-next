export type OrderDirection = "ASC" | "DESC";

export type UserRoleType =
  | "admin"
  | "staff"
  | "accountant"
  | "dealer"
  | "hr";

export type UserStatusType =
  | "active"
  | "blocked"
  | "inactive"
  | "pending";

export interface UserListItem {
  id: string;
  idNo?: number | null;
  openToken?: string | null;
  createdById?: string | null;
  email?: string | null;
  role?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  mobile?: string | null;
  state?: string | null;
  pancardNo?: string | null;
  status?: string | null;
  vehicleBuyingLimit?: number | null;
  paymentsCount?: number | null;
  createdAt?: string | null;
  registrationExpiryDate?: string | null;
  activeBids?: { id: string }[] | null;
}

export interface PendingUserItem {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  pancardNo: string;
  state?: string | null;
  createdAt?: string | null;
}

export interface DeletedUserItem {
  id: string;
  idNo?: number | null;
  email?: string | null;
  role?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  mobile?: string | null;
  state?: string | null;
  deletedById?: string | null;
  deletedAt?: string | null;
}

export interface UserDetail {
  id: string;
  idNo?: number | null;
  registrationExpiryDate?: string | null;
  email?: string | null;
  vehicleBuyingLimit?: number | null;
  username?: string | null;
  role?: string | null;
  state?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  businessName?: string | null;
  mobile?: string | null;
  BalanceEMDAmount?: number | null;
  pancardNo?: string | null;
  idProofNo?: string | null;
  country?: string | null;
  city?: string | null;
  openToken?: string | null;
  userCategory?: string | null;
  paymentsCount?: number | null;
  status?: string | null;
  states?: { id: string; name: string }[] | null;
  seller?: { id: string; name: string }[] | null;
  activeBids?: { id: string }[] | null;
  pancard_image?: string | null;
  aadharcard_front_image?: string | null;
  aadharcard_back_image?: string | null;
  driving_license_front_image?: string | null;
  driving_license_back_image?: string | null;
}

export interface UserWhereInput {
  state?: string[];
  role?: UserRoleType;
  status?: UserStatusType;
  registrationExpiryDate?: string;
}

export interface UsersQueryVariables {
  take?: number;
  skip?: number;
  search?: string;
  where?: UserWhereInput;
  orderBy?: { createdAt?: OrderDirection }[];
}

export interface UsersQueryResult {
  users: {
    users: UserListItem[];
    usersCount?: number | null;
  };
}

export interface PendingUsersQueryResult {
  getPendingUsers: {
    pendingUsers: PendingUserItem[];
    pendingUsersCount?: number | null;
  };
}

export interface DeletedUsersQueryResult {
  deletedUsers: {
    users: DeletedUserItem[];
    deletedUserCount?: number | null;
  };
}

export interface ViewUserQueryResult {
  user: UserDetail | null;
}

export interface CreateUserInput {
  firstName: string;
  lastName?: string;
  email?: string;
  mobile: string;
  pancardNo: string;
  state: string;
}

export interface SelectOption {
  label: string;
  value: string;
  labelValue?: string;
}

export interface EditUserFormValues {
  firstName: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  role?: string;
  idProofNo?: string;
  state?: string;
  pancardNo?: string;
  status?: string;
  states?: SelectOption[];
  seller?: SelectOption[];
  openTokenNumber?: string;
}

export type EmdAmountOperator = "gt" | "gte" | "lt" | "lte" | "equals";

export interface PaymentAmountFilterInput {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  equals?: number;
}

export interface UserEmdPaymentWhereInput {
  state?: string | string[];
  status?: string;
  role?: string;
  payments?: {
    some?: {
      amount?: PaymentAmountFilterInput;
      paymentFor?: string;
      status?: string;
    };
  };
}

export interface EmdApprovedUser {
  id: string;
  firstName: string;
  state: string;
  lastName: string;
  mobile: string;
  status: string;
  createdAt?: string | null;
}
