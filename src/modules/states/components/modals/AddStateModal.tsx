"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, Modal, Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import { CREATE_STATE_MUTATION } from "@/graphql/documents/states";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { INDIAN_STATES } from "@/modules/users/constants";
import type { CreateStateFormValues } from "@/modules/states/types";
import { formatStateDisplay } from "@/modules/users/utils";

interface AddStateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const stateOptions = INDIAN_STATES.map((state) => ({
  value: state.value,
  label: state.label,
}));

export function AddStateModal({ open, onClose, onSuccess }: AddStateModalProps) {
  const [createState, { loading }] = useMutation(CREATE_STATE_MUTATION);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStateFormValues>();

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (formData: CreateStateFormValues) => {
    const name = formData.name;

    try {
      await createState({
        variables: {
          createStateInput: { name },
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: `${formatStateDisplay(name)} added successfully.`,
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
      title="Add State"
      size="md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            isLoading={loading}
            onClick={handleSubmit(onSubmit)}
          >
            Add State
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="State Name"
          htmlFor="add-state-name"
          required
          error={errors.name?.message}
        >
          <Select
            id="add-state-name"
            placeholder="Select state"
            options={stateOptions}
            {...register("name", { required: "State is required" })}
          />
        </FormField>
      </form>
    </Modal>
  );
}
