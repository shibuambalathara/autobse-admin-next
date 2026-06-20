"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, Modal } from "@/components/ui";
import { Textarea } from "@/components/forms";
import { DELETE_BID_MUTATION, RESTORE_BID_MUTATION } from "@/graphql/documents/bids";
import { extractGraphqlError } from "@/lib/graphql-errors";

interface BidActionModalProps {
  open: boolean;
  bidId: string | null;
  actionType: "delete" | "restore";
  onClose: () => void;
  onSuccess: () => void;
}

export function BidActionModal({
  open,
  bidId,
  actionType,
  onClose,
  onSuccess,
}: BidActionModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [deleteBid, { loading: deleting }] = useMutation(DELETE_BID_MUTATION);
  const [restoreBid, { loading: restoring }] = useMutation(RESTORE_BID_MUTATION);

  const loading = deleting || restoring;

  const handleAction = async () => {
    if (!bidId) return;

    if (actionType === "delete" && !reason.trim()) {
      setError("The reason cannot be empty");
      return;
    }

    try {
      if (actionType === "delete") {
        await deleteBid({
          variables: {
            where: { id: bidId },
            deleteBidInput: { reasonForDeletion: reason.trim() },
          },
        });
      } else {
        await restoreBid({
          variables: {
            where: { id: bidId },
            restoreBidInput: {
              reasonForRestore: reason.trim() || "Restored by admin",
            },
          },
        });
      }

      await Swal.fire({
        icon: "success",
        title: actionType === "delete" ? "Bid deleted" : "Bid restored",
        timer: 2000,
        showConfirmButton: false,
      });
      setReason("");
      setError("");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const { message } = extractGraphqlError(err);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={actionType === "delete" ? "Delete Bid" : "Restore Bid"}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="bid-reason" className="text-sm font-medium">
            {actionType === "delete" ? "Reason for deletion" : "Reason (optional)"}
          </label>
          <Textarea
            id="bid-reason"
            rows={3}
            maxLength={80}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            placeholder={
              actionType === "delete"
                ? "Enter the reason for deleting this bid…"
                : "Restored by admin"
            }
          />
          {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={actionType === "delete" ? "danger" : "primary"}
            disabled={loading}
            onClick={handleAction}
          >
            {loading ? "Saving…" : actionType === "delete" ? "Delete" : "Restore"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
