"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { Button, Input, Select as NativeSelect } from "@/components/ui";
import { FormField, FormGrid } from "@/components/forms";
import {
  INDIAN_STATES,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from "@/modules/users/constants";
import { editUserValidation } from "@/modules/users/forms/validation";
import type { EditUserFormValues, SelectOption } from "@/modules/users/types";

interface EditUserProfileFormProps {
  defaultValues?: EditUserFormValues;
  isEditable: boolean;
  selectedStateCode: string;
  stateOptions: SelectOption[];
  sellerOptions: SelectOption[];
  onStateChange: (state?: string) => void;
  onSubmit: (values: EditUserFormValues) => Promise<void>;
  loading?: boolean;
}

export function EditUserProfileForm({
  defaultValues,
  isEditable,
  selectedStateCode,
  stateOptions,
  sellerOptions,
  onStateChange,
  onSubmit,
  loading,
}: EditUserProfileFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditUserFormValues>();

  const watchedState = watch("state");

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
      onStateChange(defaultValues.state);
    }
  }, [defaultValues, reset, onStateChange]);

  useEffect(() => {
    onStateChange(watchedState);
  }, [watchedState, onStateChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormGrid columns={2}>
        <FormField
          label="First Name"
          htmlFor="firstName"
          required
          error={errors.firstName?.message}
        >
          <Input
            id="firstName"
            disabled={!isEditable}
            {...register("firstName", editUserValidation.firstName)}
          />
        </FormField>
        <FormField label="Last Name" htmlFor="lastName" error={errors.lastName?.message}>
          <Input
            id="lastName"
            disabled={!isEditable}
            {...register("lastName", editUserValidation.lastName)}
          />
        </FormField>
        <FormField label="Email" htmlFor="email">
          <Input id="email" disabled={!isEditable} {...register("email")} />
        </FormField>
        <FormField label="Mobile" htmlFor="mobile" error={errors.mobile?.message}>
          <Input
            id="mobile"
            disabled={!isEditable}
            {...register("mobile", editUserValidation.mobile)}
          />
        </FormField>
        <FormField label="Role" htmlFor="role">
          <NativeSelect
            id="role"
            disabled={!isEditable}
            options={[...USER_ROLE_OPTIONS]}
            {...register("role")}
          />
        </FormField>
        <FormField
          label="ID Proof Number"
          htmlFor="idProofNo"
          error={errors.idProofNo?.message}
        >
          <Input
            id="idProofNo"
            disabled={!isEditable}
            {...register("idProofNo", editUserValidation.idProofNo)}
          />
        </FormField>
        <FormField
          label="State"
          htmlFor="state"
          required
          error={errors.state?.message}
        >
          <NativeSelect
            id="state"
            disabled={!isEditable}
            options={INDIAN_STATES}
            {...register("state", editUserValidation.state)}
          />
        </FormField>
        <FormField
          label="Pancard No"
          htmlFor="pancardNo"
          required
          error={errors.pancardNo?.message}
        >
          <Input
            id="pancardNo"
            disabled={!isEditable}
            {...register("pancardNo", editUserValidation.pancardNo)}
          />
        </FormField>
        <FormField label="Status" htmlFor="status">
          <NativeSelect
            id="status"
            disabled={!isEditable}
            options={[...USER_STATUS_OPTIONS]}
            {...register("status")}
          />
        </FormField>
        <FormField
          label="Auction Allowed States"
          htmlFor="states"
          required
          error={
            errors.states?.message as string | undefined
          }
        >
          <Controller
            name="states"
            control={control}
            rules={editUserValidation.states}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                isDisabled={!isEditable}
                options={stateOptions}
                className="text-sm"
                classNamePrefix="rs"
              />
            )}
          />
        </FormField>
        <FormField label="Open Auction Token" htmlFor="openTokenNumber">
          <div className="flex overflow-hidden rounded-md border border-surface-border">
            <span className="flex items-center bg-surface-muted px-3 text-sm text-brand-600">
              {selectedStateCode || "—"}
            </span>
            <Input
              id="openTokenNumber"
              disabled={!isEditable}
              className="border-0 focus-visible:ring-0"
              placeholder="0004"
              {...register("openTokenNumber", editUserValidation.openTokenNumber)}
            />
          </div>
        </FormField>
        <FormField label="Auction Allowed Sellers" htmlFor="seller">
          <Controller
            name="seller"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                isDisabled={!isEditable}
                options={sellerOptions}
                className="text-sm"
                classNamePrefix="rs"
              />
            )}
          />
        </FormField>
      </FormGrid>
      <div className="flex justify-end">
        <Button type="submit" disabled={!isEditable} isLoading={loading}>
          Update Profile
        </Button>
      </div>
    </form>
  );
}
