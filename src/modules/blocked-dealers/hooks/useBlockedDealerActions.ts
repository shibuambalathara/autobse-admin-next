"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import {
  BLOCK_DEALER_MUTATION,
  UNBLOCK_DEALER_MUTATION,
} from "@/graphql/documents/blocked-dealers";
import { extractGraphqlError } from "@/lib/graphql-errors";
import {
  isValidPanCard,
  normalizePanCard,
} from "@/modules/blocked-dealers/constants";
import type {
  BlockDealerInput,
  BlockWhereUniqueInput,
} from "@/modules/blocked-dealers/types";

export function useBlockedDealerActions(onSuccess?: () => void) {
  const [blockDealerMutation, { loading: blocking }] =
    useMutation(BLOCK_DEALER_MUTATION);
  const [unblockDealerMutation, { loading: unblocking }] =
    useMutation(UNBLOCK_DEALER_MUTATION);

  const blockDealer = useCallback(
    async (where: BlockWhereUniqueInput, input: BlockDealerInput) => {
      const panCardNo = normalizePanCard(input.panCardNo);
      const reason = input.reason.trim();

      if (!isValidPanCard(panCardNo)) {
        await Swal.fire({
          icon: "error",
          title: "Invalid PAN",
          text: "Enter a valid PAN (e.g. ABCDE1234F).",
        });
        return false;
      }

      if (!reason) {
        await Swal.fire({
          icon: "error",
          title: "Reason required",
          text: "Please enter a reason for blocking.",
        });
        return false;
      }

      const confirm = await Swal.fire({
        title: "Confirm block",
        text: `Block dealer with PAN ${panCardNo}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, block",
      });

      if (!confirm.isConfirmed) return false;

      try {
        await blockDealerMutation({
          variables: {
            where,
            blockDealerInput: { panCardNo, reason },
          },
        });

        await Swal.fire({
          icon: "success",
          title: "Blocked",
          text: "Dealer blocked successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        onSuccess?.();
        return true;
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Failed", text: message });
        return false;
      }
    },
    [blockDealerMutation, onSuccess]
  );

  const unblockDealer = useCallback(
    async (where: BlockWhereUniqueInput, input: BlockDealerInput) => {
      const panCardNo = normalizePanCard(input.panCardNo);
      const reason = input.reason.trim();

      if (!reason) {
        await Swal.fire({
          icon: "error",
          title: "Reason required",
          text: "Please enter a reason for unblocking.",
        });
        return false;
      }

      const confirm = await Swal.fire({
        title: "Confirm unblock",
        text: `Unblock dealer with PAN ${panCardNo}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, unblock",
      });

      if (!confirm.isConfirmed) return false;

      try {
        await unblockDealerMutation({
          variables: {
            where,
            blockDealerInput: { panCardNo, reason },
          },
        });

        await Swal.fire({
          icon: "success",
          title: "Unblocked",
          text: "Dealer unblocked successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        onSuccess?.();
        return true;
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Failed", text: message });
        return false;
      }
    },
    [onSuccess, unblockDealerMutation]
  );

  const blockSellerForUser = useCallback(
    async (
      pancardNo: string,
      sellerId: string,
      reason: string
    ): Promise<boolean> => {
      if (!sellerId) {
        await Swal.fire({
          icon: "error",
          title: "Seller required",
          text: "Please select a seller.",
        });
        return false;
      }

      if (!reason.trim()) {
        await Swal.fire({
          icon: "error",
          title: "Reason required",
          text: "Please enter a reason for blocking.",
        });
        return false;
      }

      try {
        await blockDealerMutation({
          variables: {
            where: { pancardNo, sellerId },
            blockDealerInput: {
              panCardNo: normalizePanCard(pancardNo),
              reason: reason.trim(),
            },
          },
        });

        await Swal.fire({
          icon: "success",
          title: "Blocked",
          text: "Seller blocked successfully for this user.",
          timer: 2000,
          showConfirmButton: false,
        });
        onSuccess?.();
        return true;
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Failed", text: message });
        return false;
      }
    },
    [blockDealerMutation, onSuccess]
  );

  return {
    blockDealer,
    unblockDealer,
    blockSellerForUser,
    blocking,
    unblocking,
  };
}
