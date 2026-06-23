export interface BlockedDealerSeller {
  id?: string | null;
  name?: string | null;
}

export interface BlockedDealer {
  id: string;
  panCardNo: string;
  reason?: string | null;
  createdAt: string;
  createdById?: string | null;
  seller?: BlockedDealerSeller | null;
}

export interface BlockedDealersListResult {
  getBlockedDealers: {
    blockedCount?: number | null;
    blockedDealer: BlockedDealer[];
  };
}

export interface BlockWhereUniqueInput {
  sellerId?: string;
  pancardNo?: string;
}

export interface BlockDealerInput {
  panCardNo: string;
  reason: string;
}

export interface ListBlockedDealersVariables {
  where?: BlockWhereUniqueInput;
  orderBy?: { createdAt?: "ASC" | "DESC" };
  take?: number;
  skip?: number;
  search?: string;
}

export interface UnblockDealerPayload {
  pan: string;
  sellerId?: string;
}
