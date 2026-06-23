"use client";

import { Modal } from "@/components/ui";
import { EnterBidForm } from "@/modules/bids/components/EnterBidForm";
import type { BidModalEvent, BidModalVehicle } from "@/modules/bids/types";

interface BidModalProps {
  open: boolean;
  vehicle: BidModalVehicle | null;
  event?: BidModalEvent | null;
  eventCategory?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function BidModal({
  open,
  vehicle,
  event,
  eventCategory,
  onClose,
  onSuccess,
}: BidModalProps) {
  if (!vehicle) return null;

  return (
    <Modal open={open} onClose={onClose} title="Create Bid" size="md">
      <dl className="mb-4 grid gap-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Registration</dt>
          <dd className="font-semibold">{vehicle.registrationNumber ?? "—"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Start Price</dt>
          <dd className="font-semibold">
            {vehicle.startPrice != null ? `₹ ${vehicle.startPrice}` : "—"}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Current Bid</dt>
          <dd className="font-semibold">₹ {vehicle.currentBidAmount ?? 0}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Quote Increment</dt>
          <dd className="font-semibold">₹ {vehicle.quoteIncreament ?? 0}</dd>
        </div>
      </dl>

      <EnterBidForm
        vehicle={vehicle}
        event={event}
        eventCategory={eventCategory}
        onSuccess={() => {
          onSuccess();
          onClose();
        }}
      />
    </Modal>
  );
}
