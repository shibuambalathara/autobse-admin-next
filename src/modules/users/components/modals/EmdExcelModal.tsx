"use client";

import { useEffect, useState } from "react";
import { Button, Input, Modal, Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import {
  EMD_AMOUNT_OPERATOR_OPTIONS,
  EMD_PAYMENT_STATUS_OPTIONS,
  INDIAN_STATES,
  PAYMENTS_FOR_OPTIONS,
} from "@/modules/users/constants";
import type { EmdAmountOperator } from "@/modules/users/types";

interface EmdExcelModalProps {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  initialState?: string;
  onDownload: (params: {
    skip: number;
    take: number;
    operator: EmdAmountOperator;
    amount: number;
    state: string;
    paymentFor: string;
    paymentStatus: string;
  }) => Promise<boolean | void>;
  getCount: (params: {
    operator: EmdAmountOperator;
    amount: number;
    state: string;
    paymentFor: string;
    paymentStatus: string;
  }) => Promise<number>;
}

export function EmdExcelModal({
  open,
  onClose,
  loading,
  initialState = "",
  onDownload,
  getCount,
}: EmdExcelModalProps) {
  const [skip, setSkip] = useState("0");
  const [take, setTake] = useState("100");
  const [operator, setOperator] = useState<EmdAmountOperator>("gt");
  const [amount, setAmount] = useState("0");
  const [state, setState] = useState(initialState);
  const [paymentFor, setPaymentFor] = useState("emd");
  const [paymentStatus, setPaymentStatus] = useState("approved");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setSkip("0");
    setTake("100");
    setOperator("gt");
    setAmount("0");
    setState(initialState);
    setPaymentFor("emd");
    setPaymentStatus("approved");
  }, [open, initialState]);

  useEffect(() => {
    if (!open) return;
    const num = Number(amount);
    if (amount === "" || Number.isNaN(num)) {
      setCount(null);
      return;
    }
    let cancelled = false;
    getCount({ operator, amount: num, state, paymentFor, paymentStatus })
      .then((c) => {
        if (!cancelled) setCount(c);
      })
      .catch(() => {
        if (!cancelled) setCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, [open, operator, amount, state, paymentFor, paymentStatus, getCount]);

  return (
    <Modal open={open} onClose={onClose} title="Download EMD Approved Users Excel" size="lg">
      <div className="space-y-4">
        {count != null && (
          <p className="text-sm text-brand-600">
            Total EMD approved users: <strong>{count}</strong>
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Payment For" htmlFor="emd-payment-for">
            <Select
              id="emd-payment-for"
              options={PAYMENTS_FOR_OPTIONS}
              value={paymentFor}
              onChange={(e) => setPaymentFor(e.target.value)}
            />
          </FormField>
          <FormField label="Payment Status" htmlFor="emd-payment-status">
            <Select
              id="emd-payment-status"
              options={[...EMD_PAYMENT_STATUS_OPTIONS]}
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            />
          </FormField>
        </div>
        <FormField label="State" htmlFor="emd-state">
          <Select
            id="emd-state"
            options={[{ label: "All states", value: "" }, ...INDIAN_STATES]}
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Condition" htmlFor="emd-operator">
            <Select
              id="emd-operator"
              options={EMD_AMOUNT_OPERATOR_OPTIONS}
              value={operator}
              onChange={(e) =>
                setOperator(e.target.value as EmdAmountOperator)
              }
            />
          </FormField>
          <FormField label="Amount" htmlFor="emd-amount">
            <Input
              id="emd-amount"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormField>
        </div>
        <FormField label="Skip" htmlFor="emd-skip">
          <Input
            id="emd-skip"
            type="number"
            min={0}
            value={skip}
            onChange={(e) => setSkip(e.target.value)}
          />
        </FormField>
        <FormField label="Take" htmlFor="emd-take">
          <Input
            id="emd-take"
            type="number"
            min={1}
            value={take}
            onChange={(e) => setTake(e.target.value)}
          />
        </FormField>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            isLoading={loading}
            onClick={async () => {
              const ok = await onDownload({
                skip: Number(skip),
                take: Number(take),
                operator,
                amount: Number(amount),
                state,
                paymentFor,
                paymentStatus,
              });
              if (ok) onClose();
            }}
          >
            Download Excel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
