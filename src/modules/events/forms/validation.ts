import type { RegisterOptions } from "react-hook-form";

const digitsOnly = (limit?: number) => ({
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = event.target.value.replace(/[^0-9]/g, "");
    if (limit && event.target.value.length > limit) {
      event.target.value = event.target.value.slice(0, limit);
    }
  },
});

export const addEventValidation = {
  eventCategory: {
    required: "Event category is required",
  } satisfies RegisterOptions,
  startDate: {
    required: "Start date is required",
  } satisfies RegisterOptions,
  endDate: {
    required: "End date is required",
  } satisfies RegisterOptions,
  sellerName: {
    required: "Seller is required",
  } satisfies RegisterOptions,
  eventId: {
    required: "Vehicle category is required",
  } satisfies RegisterOptions,
  location: {
    required: "Location is required",
  } satisfies RegisterOptions,
  noOfBids: {
    required: "Number of bids is required",
    ...digitsOnly(4),
  } satisfies RegisterOptions,
  status: {
    required: "Auction status is required",
  } satisfies RegisterOptions,
  lockedOrNot: {
    required: "Bid lock is required",
  } satisfies RegisterOptions,
  metaEventId: {
    required: "Meta Event ID is required for Meta Auction",
    ...digitsOnly(),
  } satisfies RegisterOptions,
  metaEventType: {
    required: "Meta Event Type is required",
  } satisfies RegisterOptions,
  autobseContact: {
    pattern: {
      value: /^[0-9]{10}$/,
      message: "Enter a valid 10-digit contact number",
    },
    ...digitsOnly(10),
  } satisfies RegisterOptions,
};
