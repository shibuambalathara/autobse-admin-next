"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, Modal, Select } from "@/components/ui";
import { FormField, Textarea } from "@/components/forms";
import { CREATE_PAYMENT_STATUS_MUTATION } from "@/graphql/documents/payments";
import { PAYMENT_STATUS_OPTIONS } from "@/modules/payments/constants";
import { extractGraphqlError } from "@/lib/graphql-errors";

interface ChangePaymentStatusModalProps {
  open: boolean;
  paymentId: string | null;
  paymentFor?: string | null;
  currentStatus?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChangePaymentStatusModal({
  open,
  paymentId,
  paymentFor,
  currentStatus,
  onClose,
  onSuccess,
}: ChangePaymentStatusModalProps) {
  const [status, setStatus] = useState(currentStatus ?? "pending");
  const [extendMonths, setExtendMonths] = useState("");
  const [comment, setComment] = useState("");
  const [createPaymentStatus, { loading }] = useMutation(CREATE_PAYMENT_STATUS_MUTATION);

  const isRegistration = paymentFor?.toLowerCase() === "registrations";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!paymentId) return;

    const confirm = await Swal.fire({
      title: "Save Changes Confirmation",
      html: `Are you sure you want to update the payment?<br><span style="color: red;">Warning: This action is irreversible.</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await createPaymentStatus({
        variables: {
          createStatusInput: {
            status,
            PaymentId: paymentId,
            comment: comment.trim() || undefined,
            extendMonths: isRegistration && extendMonths !== ""
              ? Number(extendMonths)
              : null,
          },
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Payment status updated",
        timer: 2000,
        showConfirmButton: false,
      });
      onSuccess();
      onClose();
      setComment("");
      setExtendMonths("");
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Change Status">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Payment Status" htmlFor="payment-status">
          <Select
            id="payment-status"
            options={PAYMENT_STATUS_OPTIONS.map((o) => ({
              label: o.label,
              value: o.value,
            }))}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </FormField>

        {isRegistration && (
          <FormField label="Extend Months" htmlFor="extend-months">
            <input
              id="extend-months"
              type="number"
              min={0}
              value={extendMonths}
              onChange={(e) => setExtendMonths(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter months (e.g., 2)"
            />
          </FormField>
        )}

        <FormField label="Comments (optional)" htmlFor="payment-comment">
          <Textarea
            id="payment-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={80}
            rows={2}
            placeholder="Comments..."
          />
        </FormField>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Change Status"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
