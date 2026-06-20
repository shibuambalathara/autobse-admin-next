"use client";

import { useEffect } from "react";
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
  onSubmit: (vehicleId: string, status: string) => Promise<void>;
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
    }
  }, [open, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit(vehicleId, values.vehicleStatus);
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
