"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Select, Button } from "@/components/ui";
import { FormField } from "@/components/forms";
import { useAccess } from "@/auth/use-access";
import { getVehicleStatusOptions } from "@/modules/event-vehicles/constants/vehicle-status-options";

interface ChangeVehicleStatusModalProps {
  open: boolean;
  vehicleId: string;
  currentBidStatus: string;
  onClose: () => void;
  onSubmit: (vehicleId: string, status: string) => Promise<string | void>;
}

interface FormValues {
  vehicleStatus: string;
}

export function ChangeVehicleStatusModal({
  open,
  vehicleId,
  currentBidStatus,
  onClose,
  onSubmit,
}: ChangeVehicleStatusModalProps) {
  const { role } = useAccess();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const options = getVehicleStatusOptions(role, currentBidStatus);

  useEffect(() => {
    if (open) {
      reset({ vehicleStatus: "" });
      setSubmitError(null);
    }
  }, [open, reset]);

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    const errorMessage = await onSubmit(vehicleId, values.vehicleStatus);
    if (errorMessage) {
      setSubmitError(errorMessage);
    }
  });

  return (
    <Modal open={open} onClose={onClose} title="Change Status" size="md">
      <form onSubmit={submit} className="space-y-4">
        <FormField
          label="Vehicle Status"
          htmlFor="vehicleStatus"
          required
          error={errors.vehicleStatus?.message}
        >
          <Select
            id="vehicleStatus"
            placeholder="Select status"
            options={options}
            {...register("vehicleStatus", {
              required: "Please select vehicle status",
            })}
          />
        </FormField>
        {submitError && (
          <p className="text-sm font-bold text-red-600" role="alert">
            {submitError}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Change Status
          </Button>
        </div>
      </form>
    </Modal>
  );
}
