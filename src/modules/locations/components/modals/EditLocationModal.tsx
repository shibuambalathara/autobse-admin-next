"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, Input, Modal, Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import { UPDATE_LOCATION_MUTATION } from "@/graphql/documents/locations";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { useLocationStateOptions } from "@/modules/locations/hooks/useLocationStateOptions";
import type {
  EditLocationFormValues,
  Location,
} from "@/modules/locations/types";

interface EditLocationModalProps {
  open: boolean;
  location: Location | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditLocationModal({
  open,
  location,
  onClose,
  onSuccess,
}: EditLocationModalProps) {
  const { stateOptions, loading: statesLoading } = useLocationStateOptions();
  const [updateLocation, { loading }] = useMutation(UPDATE_LOCATION_MUTATION);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditLocationFormValues>();

  useEffect(() => {
    if (!open || !location) return;
    reset({
      name: location.name,
      stateId: location.state?.id ?? "",
    });
  }, [open, location, reset]);

  const onSubmit = async (formData: EditLocationFormValues) => {
    if (!location) return;

    try {
      await updateLocation({
        variables: {
          where: { id: location.id },
          updateLocationInput: {
            name: formData.name.trim(),
            stateId: formData.stateId,
          },
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Location updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Location"
      size="md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            isLoading={loading}
            disabled={statesLoading || !location}
            onClick={handleSubmit(onSubmit)}
          >
            Update
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="City"
          htmlFor="edit-location-city"
          required
          error={errors.name?.message}
        >
          <Input
            id="edit-location-city"
            {...register("name", { required: "City is required" })}
          />
        </FormField>

        <FormField
          label="State"
          htmlFor="edit-location-state"
          required
          error={errors.stateId?.message}
        >
          <Select
            id="edit-location-state"
            placeholder={statesLoading ? "Loading states…" : "Select state"}
            options={stateOptions}
            disabled={statesLoading}
            {...register("stateId", { required: "State is required" })}
          />
        </FormField>
      </form>
    </Modal>
  );
}
