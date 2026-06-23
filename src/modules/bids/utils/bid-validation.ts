import type { BidModalEvent, BidModalVehicle } from "@/modules/bids/types";

export function calculateNextBidAmount(vehicle: BidModalVehicle): number {
  if (vehicle.currentBidAmount) {
    return vehicle.currentBidAmount + (vehicle.quoteIncreament ?? 0);
  }
  return vehicle.startPrice ?? vehicle.quoteIncreament ?? 0;
}

export interface ValidateBidInput {
  amount: number;
  mobile: string;
  openToken: string;
  isOpenEvent: boolean;
  vehicle: BidModalVehicle;
  event?: BidModalEvent | null;
}

export function validateBidSubmission({
  amount,
  mobile,
  openToken,
  isOpenEvent,
  vehicle,
  event,
}: ValidateBidInput): string | null {
  if (isOpenEvent) {
    if (!mobile && !openToken) {
      return "Enter mobile or select state & open auction token.";
    }
  } else if (!mobile) {
    return "Mobile number is required.";
  }

  if (mobile && mobile.length !== 10) {
    return "Mobile must be 10 digits.";
  }

  const effectiveAmount = amount === 0 ? (vehicle.startPrice ?? 0) : amount;
  const quoteIncrement = vehicle.quoteIncreament ?? 1;

  if (
    event?.bidLock === "locked" &&
    (vehicle.currentBidAmount ?? 0) >= effectiveAmount
  ) {
    return "Bid amount should be greater than last bid.";
  }

  if (effectiveAmount % quoteIncrement !== 0) {
    return "Bid amount should be a multiple of quote increment.";
  }

  if ((vehicle.startPrice ?? 0) > effectiveAmount) {
    return "Bid amount should be greater than start price.";
  }

  if (effectiveAmount > 2147483647) {
    return "Bid amount exceeded the limit.";
  }

  return null;
}

export function buildOpenToken(stateCode: string, tokenNumber: string): string {
  if (!stateCode || !tokenNumber) return "";
  return `${stateCode}${tokenNumber.padStart(4, "0")}`;
}
