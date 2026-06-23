"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, Input, Modal, Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import { CREATE_LOCATION_MUTATION } from "@/graphql/documents/locations";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { useLocationStateOptions } from "@/modules/locations/hooks/useLocationStateOptions";
import type { CreateLocationFormValues } from "@/modules/locations/types";

interface AddLocationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddLocationModal({
  open,
  onClose,
  onSuccess,
}: AddLocationModalProps) {
  const { stateOptions, loading: statesLoading } = useLocationStateOptions();
  const [createLocation, { loading }] = useMutation(CREATE_LOCATION_MUTATION);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLocationFormValues>();

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (formData: CreateLocationFormValues) => {
    try {
      await createLocation({
        variables: {
          createLocationInput: { name: formData.name.trim() },
          stateId: formData.stateId,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Location added successfully.",
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
      title="Add Location"
      size="md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            isLoading={loading}
            disabled={statesLoading}
            onClick={handleSubmit(onSubmit)}
          >
            Add Location
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="City"
          htmlFor="add-location-city"
          required
          error={errors.name?.message}
        >
          <Input
            id="add-location-city"
            {...register("name", { required: "City is required" })}
          />
        </FormField>

        <FormField
          label="State"
          htmlFor="add-location-state"
          required
          error={errors.stateId?.message}
        >
          <Select
            id="add-location-state"
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
