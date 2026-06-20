"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, Input, Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import { CREATE_BID_MUTATION } from "@/graphql/documents/bids";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { INDIAN_STATE_OPTIONS } from "@/modules/bids/constants";
import type { BidModalEvent, BidModalVehicle } from "@/modules/bids/types";
import {
  buildOpenToken,
  calculateNextBidAmount,
  validateBidSubmission,
} from "@/modules/bids/utils/bid-validation";

interface EnterBidFormProps {
  vehicle: BidModalVehicle;
  event?: BidModalEvent | null;
  eventCategory?: string;
  onSuccess: () => void;
}

export function EnterBidForm({
  vehicle,
  event,
  eventCategory,
  onSuccess,
}: EnterBidFormProps) {
  const [createBid, { loading }] = useMutation(CREATE_BID_MUTATION);
  const [mobile, setMobile] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [tokenNumber, setTokenNumber] = useState("");

  const isOpenEvent = eventCategory === "open";

  useEffect(() => {
    setBidAmount(String(calculateNextBidAmount(vehicle)));
  }, [vehicle]);

  const handleSubmit = async () => {
    const amount = Number.parseInt(bidAmount, 10) || 0;
    const openToken = buildOpenToken(stateCode, tokenNumber);
    const validationError = validateBidSubmission({
      amount,
      mobile,
      openToken,
      isOpenEvent,
      vehicle,
      event,
    });

    if (validationError) {
      await Swal.fire({ icon: "warning", title: validationError });
      return;
    }

    const effectiveAmount = amount === 0 ? (vehicle.startPrice ?? 0) : amount;

    try {
      await createBid({
        variables: {
          bidVehicleId: vehicle.id,
          createBidInput: { amount: effectiveAmount },
          userUniqueInput: openToken ? { openToken } : { mobile },
        },
      });
      await Swal.fire({
        icon: "success",
        title: "Bid submitted",
        timer: 2000,
        showConfirmButton: false,
      });
      onSuccess();
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <FormField
        label={
          isOpenEvent
            ? "Mobile (or enter open auction token below)"
            : "Mobile"
        }
        htmlFor="bid-mobile"
      >
        <Input
          id="bid-mobile"
          value={mobile}
          placeholder="10-digit mobile number"
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
            setMobile(value);
            if (value) {
              setStateCode("");
              setTokenNumber("");
            }
          }}
        />
      </FormField>

      {isOpenEvent && (
        <>
          <FormField label="Open auction token state" htmlFor="bid-state">
            <Select
              id="bid-state"
              options={INDIAN_STATE_OPTIONS.map((s) => ({
                value: s.value,
                label: s.label,
              }))}
              placeholder="Select state"
              value={stateCode}
              onChange={(e) => {
                setStateCode(e.target.value);
                if (e.target.value) setMobile("");
              }}
            />
          </FormField>
          <FormField label="Token number" htmlFor="bid-token">
            <div className="flex overflow-hidden rounded-md border border-border">
              <span className="flex items-center bg-muted px-3 text-sm">
                {stateCode || "--"}
              </span>
              <Input
                id="bid-token"
                className="border-0"
                placeholder="0004"
                value={tokenNumber}
                onChange={(e) =>
                  setTokenNumber(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
              />
            </div>
          </FormField>
        </>
      )}

      <FormField label="Amount" htmlFor="bid-amount">
        <Input
          id="bid-amount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value.replace(/\D/g, ""))}
        />
      </FormField>

      <Button type="button" className="w-full" disabled={loading} onClick={handleSubmit}>
        {loading ? "Submitting…" : "Bid Now"}
      </Button>
    </div>
  );
}
