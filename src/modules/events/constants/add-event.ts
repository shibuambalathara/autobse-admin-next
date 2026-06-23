import type { EventCategory } from "@/modules/events/types";

export const META_SELLER_NAMES = [
  "manba finance",
  "mahaveer finance",
  "credit wise capital",
  "ikf finance limited",
  "tata capital ltd",
] as const;

export const ADD_EVENT_CATEGORY_OPTIONS: {
  label: string;
  value: EventCategory;
}[] = [
  { value: "online", label: "Online Auction" },
  { value: "open", label: "Open Auction" },
  { value: "auctionReport", label: "Auction Report" },
];

export const AUCTION_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "blocked", label: "Blocked" },
  { value: "inactive", label: "Inactive" },
  { value: "stop", label: "Stop" },
];

export const EVENT_BID_LOCK_OPTIONS = [
  { value: "locked", label: "Locked" },
  { value: "unlocked", label: "Unlocked" },
];

export const META_EVENT_TYPE_OPTIONS = [
  { value: "CLOSED", label: "CLOSED" },
  { value: "OPEN", label: "OPEN" },
];

export const DEFAULT_EVENT_TERMS = `  1. All vehicles are sold on "As Is Where Is “basis."
  2. All vehicles to be inspected by the bidder / buyer before the auction & bidding.
  3. The bidder will be liable for transfer of vehicle.
  4. All issues related to RTO needs to be checked before bidding like RTO Objection / hold etc.
  5. Year of Manufacture and Dealer Liability (if any) will have to be confirmed by bidder before bidding.
  6. Indemnity / Bond / Undertaking if demanded by Seller will have to be fulfilled by Bidder / Buyer.
  7. Parking charges applicable as per seller’s terms & conditions. Buyer needs to check the same with respective seller before placing the bid.
  8. Bids once placed cannot be cancelled. Winning bids will be valid till month end.
  9. 10K Deposit will be forfeited per vehicle in case of default for not making payment of approved bids and ID will be blocked from auction participation in future.
  10. All the auctions are subject to approval from the seller.
  11. Payment terms: Payment to be made within 48 hours of approval.
  12. Availability of Form 36 & other transfer related documents need to be checked with seller before bidding.
  13. Seller has the right to reverse approval given for repo sale as per their company policy.
  14.Additional taxes applicable on transactions as per existing Govt. Of India rules. Please refer to seller for details.
  15. With Immediate effect no bids will be cancelled in any of the auctions. Request you to kindly place bids carefully.
  16. Release letter will be provided after submission of Documents within 72 working hours with all the best efforts as soon as possible.
  17. Buyer Fees - Upto 250K - Rs.3000 (including GST) and above 250K - 1% + GST
  18. Buyer fees must be paid the next day after the vehicle payment.
  19.Payment Defaults: Failure to pay buyer fees will be treated as a breach of contract. Reasons such as year-of-manufacturing discrepancies, missing parts, or, accidental damage etc etc will not be accepted as excuses for non-payment.
  I hereby acknowledge that I have read and understood the terms and conditions and agree to pay buyer fees by the next business day after payment for the vehicle.
  `;
