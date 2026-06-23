"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, Input, Modal } from "@/components/ui";
import { FormField } from "@/components/forms";
import { CREATE_VEHICLE_CATEGORY_MUTATION } from "@/graphql/documents/vehicle-categories";
import { extractGraphqlError } from "@/lib/graphql-errors";
import type { CreateVehicleCategoryFormValues } from "@/modules/vehicle-categories/types";

interface AddVehicleCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddVehicleCategoryModal({
  open,
  onClose,
  onSuccess,
}: AddVehicleCategoryModalProps) {
  const [createCategory, { loading }] = useMutation(
    CREATE_VEHICLE_CATEGORY_MUTATION
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVehicleCategoryFormValues>();

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (formData: CreateVehicleCategoryFormValues) => {
    const name = formData.name.trim();

    try {
      await createCategory({
        variables: {
          createVehiclecategoryInput: { name },
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: `${name} added successfully.`,
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
      title="Add Vehicle Category"
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
            Add Category
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Vehicle Category Name"
          htmlFor="add-vehicle-category-name"
          required
          error={errors.name?.message}
        >
          <Input
            id="add-vehicle-category-name"
            placeholder="Vehicle category"
            {...register("name", { required: "Category name is required" })}
          />
        </FormField>
      </form>
    </Modal>
  );
}
