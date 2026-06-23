"use client";

import { useState } from "react";
import { Button, Input, Modal, Select } from "@/components/ui";
import { FormField, Textarea } from "@/components/forms";
import { normalizePanCard } from "@/modules/blocked-dealers/constants";

interface BlockDealerModalProps {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  onSubmit: (values: { panCardNo: string; reason: string }) => Promise<boolean>;
}

export function BlockDealerModal({
  open,
  onClose,
  loading = false,
  onSubmit,
}: BlockDealerModalProps) {
  const [panCardNo, setPanCardNo] = useState("");
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setPanCardNo("");
    setReason("");
    onClose();
  };

  const handleSubmit = async () => {
    const success = await onSubmit({ panCardNo, reason });
    if (success) {
      setPanCardNo("");
      setReason("");
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Block Dealer"
      size="md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" isLoading={loading} onClick={handleSubmit}>
            Block
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="PAN Card No" htmlFor="block-dealer-pan" required>
          <Input
            id="block-dealer-pan"
            value={panCardNo}
            maxLength={10}
            placeholder="ABCDE1234F"
            onChange={(e) => setPanCardNo(normalizePanCard(e.target.value))}
          />
        </FormField>

        <FormField label="Reason" htmlFor="block-dealer-reason" required>
          <Textarea
            id="block-dealer-reason"
            rows={4}
            value={reason}
            placeholder="Enter reason for blocking"
            onChange={(e) => setReason(e.target.value)}
          />
        </FormField>
      </div>
    </Modal>
  );
}

interface UnblockDealerModalProps {
  open: boolean;
  panCardNo: string;
  onClose: () => void;
  loading?: boolean;
  onSubmit: (reason: string) => Promise<boolean>;
}

export function UnblockDealerModal({
  open,
  panCardNo,
  onClose,
  loading = false,
  onSubmit,
}: UnblockDealerModalProps) {
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleSubmit = async () => {
    const success = await onSubmit(reason);
    if (success) {
      setReason("");
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Unblock Dealer"
      description={`PAN: ${panCardNo || "—"}`}
      size="md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" isLoading={loading} onClick={handleSubmit}>
            Unblock
          </Button>
        </>
      }
    >
      <FormField label="Reason for unblocking" htmlFor="unblock-dealer-reason" required>
        <Textarea
          id="unblock-dealer-reason"
          rows={4}
          value={reason}
          placeholder="Enter reason for unblocking"
          onChange={(e) => setReason(e.target.value)}
        />
      </FormField>
    </Modal>
  );
}

interface BlockSellerModalProps {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  sellerOptions: Array<{ value: string; label: string }>;
  onSubmit: (values: { sellerId: string; reason: string }) => Promise<boolean>;
}

export function BlockSellerModal({
  open,
  onClose,
  loading = false,
  sellerOptions,
  onSubmit,
}: BlockSellerModalProps) {
  const [sellerId, setSellerId] = useState("");
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setSellerId("");
    setReason("");
    onClose();
  };

  const handleSubmit = async () => {
    const success = await onSubmit({ sellerId, reason });
    if (success) {
      setSellerId("");
      setReason("");
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Block Seller"
      size="md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" isLoading={loading} onClick={handleSubmit}>
            Block Seller
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Select Seller" htmlFor="block-seller-id" required>
          <Select
            id="block-seller-id"
            placeholder="Select seller"
            options={sellerOptions}
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
          />
        </FormField>

        <FormField label="Reason" htmlFor="block-seller-reason" required>
          <Textarea
            id="block-seller-reason"
            rows={4}
            value={reason}
            placeholder="Enter reason for blocking"
            onChange={(e) => setReason(e.target.value)}
          />
        </FormField>
      </div>
    </Modal>
  );
}
