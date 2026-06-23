export interface BidListItem {
  id: string;
  amount?: number | null;
  bidVehicleId?: string | null;
  userId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  user?: {
    openToken?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    mobile?: string | null;
  } | null;
  bidVehicle?: {
    lotNumber?: number | null;
    registrationNumber?: string | null;
    bidStatus?: string | null;
    totalBids?: number | null;
    event?: {
      eventNo?: number | null;
      seller?: { name?: string | null } | null;
    } | null;
  } | null;
}

export interface DeletedBidItem {
  id: string;
  amount?: number | null;
  name?: string | null;
  createdAt?: string | null;
}

export interface ActiveBidVehicle {
  id: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  vehicleIndexNo?: number | null;
  registrationNumber?: string | null;
  bidStatus?: string | null;
  bidStartTime?: string | null;
  bidTimeExpire?: string | null;
  startBidAmount?: number | null;
  currentBidAmount?: number | null;
  totalBids?: number | null;
  currentBidUser?: {
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    pancardNo?: string | null;
    mobile?: string | null;
  } | null;
  event?: {
    id?: string | null;
    eventNo?: number | null;
    seller?: { name?: string | null } | null;
  } | null;
}

export interface BidModalVehicle {
  id: string;
  registrationNumber?: string | null;
  startPrice?: number | null;
  currentBidAmount?: number | null;
  quoteIncreament?: number | null;
}

export interface BidModalEvent {
  bidLock?: string | null;
}
