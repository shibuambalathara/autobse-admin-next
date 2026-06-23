import type {
  BuyerPreference,
  CallStatus,
  PotentialClientStatus,
} from "@/modules/crm/constants";

export type OrderDirection = "ASC" | "DESC";

export interface PotentialClientCallLogRelationFilter {
  some?: {
    nextFollowUpAt?: string;
  };
}

export interface PotentialClientsWhereInput {
  status?: string;
  stateId?: string;
  locationId?: string;
  assignedStaffId?: string;
  buyerPreference?: string;
  createdById?: string;
  vehicleCategoryId?: string;
  callLogs?: PotentialClientCallLogRelationFilter;
}

export interface CrmClient {
  id: string;
  idNo: number;
  registeredUserId?: string | null;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  pancardNo?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  stateId?: string | null;
  createdById?: string | null;
  remarks?: string | null;
  buyerPreference?: string | null;
  status?: string | null;
  isRegisteredBuyer?: boolean | null;
  assignedStaffId?: string | null;
  assignedStaff?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  vehicleCategoryId?: string | null;
  vehicleCategory?: { id: string; name?: string | null } | null;
  locationId?: string | null;
  location?: { id: string; name?: string | null } | null;
}

export interface CrmListResult {
  potentialClients: {
    clientCount?: number | null;
    potentialClients: CrmClient[];
  };
}

export interface CrmListVariables {
  search?: string;
  skip?: number;
  take?: number;
  where?: PotentialClientsWhereInput;
  orderBy?: { createdAt?: OrderDirection }[];
}

export interface CrmDeletedClient {
  id: string;
  registeredUserId?: string | null;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  stateId?: string | null;
  assignedStaffId?: string | null;
  status?: string | null;
  isRegisteredBuyer?: boolean | null;
  buyerPreference?: string | null;
  createdById?: string | null;
}

export interface DeletedCrmListResult {
  deletedPotentialClients: {
    deletedClientCount?: number | null;
    potentialClients: CrmDeletedClient[];
  };
}

export interface DeletedCrmListVariables {
  search?: string;
  skip?: number;
  take?: number;
  where?: { id: string };
  orderBy?: { createdAt?: OrderDirection }[];
}

export interface IndividualCrmResult {
  potentialClient: CrmClient & { isRegisteredBuyer?: boolean | null };
}

export interface PotentialClientBasicInfo {
  id: string;
  idNo: number;
  firstName: string;
  lastName: string;
  mobile: string;
  state?: { name?: string | null } | null;
}

export interface PotentialClientBasicInfoResult {
  potentialClientBasicInfo: {
    potentialClientBasicInfo: PotentialClientBasicInfo[];
  };
}

export interface FilterLocationsResult {
  locations: {
    locations: { id: string; name: string }[];
  };
}

export interface StaffUsersResult {
  users: {
    users: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      mobile?: string | null;
    }[];
  };
}

export interface PotentialClientCallLogWhereInput {
  potentialClientId?: string;
  staffId?: string;
  callStatus?: string;
  nextFollowUpAt?: string;
}

export interface CrmCallLog {
  id: string;
  potentialClientId?: string | null;
  staffId?: string | null;
  staff?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  callStatus?: string | null;
  durationInSeconds?: number | null;
  remarks?: string | null;
  nextFollowUpAt?: string | null;
  createdById?: string | null;
  createdBy?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  updatedAt?: string | null;
  createdAt?: string | null;
  potentialClient?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
}

export interface CrmCallLogListResult {
  potentialClientCallLogs: {
    callLogCount?: number | null;
    callLogs: CrmCallLog[];
  };
}

export interface CrmCallLogListVariables {
  search?: string;
  skip?: number;
  take?: number;
  where?: PotentialClientCallLogWhereInput;
  orderBy?: { createdAt?: OrderDirection }[];
}

export interface IndividualCrmCallLogResult {
  potentialClientCallLog: CrmCallLog;
}

export interface DeletedCrmCallLogListResult {
  deletedPotentialClientCallLogs: {
    callLogCount?: number | null;
    callLogs: CrmCallLog[];
  };
}

export interface CreatePotentialclientInput {
  firstName?: string;
  lastName?: string;
  mobile: string;
  email?: string;
  pancardNo?: string;
  buyerPreference?: BuyerPreference | string;
  isRegisteredBuyer?: boolean;
  remarks?: string;
}

export interface UpdatePotentialclientInput {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  pancardNo?: string;
  buyerPreference?: BuyerPreference | string;
  isRegisteredBuyer?: boolean;
  remarks?: string;
  assignedStaffId?: string;
  stateId?: string;
  vehicleCategoryId?: string;
  locationId?: string;
  status?: PotentialClientStatus | string;
}

export interface CreatePotentialClientCallLogInput {
  callStatus: CallStatus | string;
  durationInSeconds?: number;
  remarks?: string;
  nextFollowUpAt?: string;
}

export interface UpdatePotentialClientCallLogInput {
  callStatus?: CallStatus | string;
  durationInSeconds?: number | null;
  remarks?: string;
  nextFollowUpAt?: string;
}

export interface CrmFilterOption {
  value: string;
  label: string;
}

export interface CrmPageFilters extends PotentialClientsWhereInput {
  nextFollowUpAt?: string;
}

export interface CallLogPageFilters {
  callStatus?: string;
  staffId?: string;
  nextFollowUpAt?: string;
}
