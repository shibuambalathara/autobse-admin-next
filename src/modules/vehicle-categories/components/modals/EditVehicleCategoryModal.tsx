"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, Input, Modal } from "@/components/ui";
import { FormField } from "@/components/forms";
import { UPDATE_VEHICLE_CATEGORY_MUTATION } from "@/graphql/documents/vehicle-categories";
import { extractGraphqlError } from "@/lib/graphql-errors";
import type {
  EditVehicleCategoryFormValues,
  VehicleCategory,
} from "@/modules/vehicle-categories/types";

interface EditVehicleCategoryModalProps {
  open: boolean;
  category: VehicleCategory | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditVehicleCategoryModal({
  open,
  category,
  onClose,
  onSuccess,
}: EditVehicleCategoryModalProps) {
  const [updateCategory, { loading }] = useMutation(
    UPDATE_VEHICLE_CATEGORY_MUTATION
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditVehicleCategoryFormValues>();

  useEffect(() => {
    if (!open || !category) return;
    reset({ name: category.name });
  }, [open, category, reset]);

  const onSubmit = async (formData: EditVehicleCategoryFormValues) => {
    if (!category) return;

    const name = formData.name.trim();
    if (name === category.name) {
      onClose();
      return;
    }

    try {
      await updateCategory({
        variables: {
          where: { id: category.id },
          updateVehiclecategoryInput: { name },
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Category name updated successfully.",
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
      title="Update Vehicle Category"
      size="md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            isLoading={loading}
            disabled={!category}
            onClick={handleSubmit(onSubmit)}
          >
            Update
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Vehicle Category Name"
          htmlFor="edit-vehicle-category-name"
          required
          error={errors.name?.message}
        >
          <Input
            id="edit-vehicle-category-name"
            placeholder="Vehicle category"
            {...register("name", { required: "Category name is required" })}
          />
        </FormField>
      </form>
    </Modal>
  );
}
