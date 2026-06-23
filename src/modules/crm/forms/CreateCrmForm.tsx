"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, FormCard, Input, Select } from "@/components/ui";
import { FormField, FormGrid, Textarea } from "@/components/forms";
import { CREATE_POTENTIAL_CLIENT_MUTATION } from "@/graphql/documents/crm";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import {
  BUYER_PREFERENCE_OPTIONS,
  IS_REGISTERED_BUYER_OPTIONS,
} from "@/modules/crm/constants";
import { useCrmFilterOptions } from "@/modules/crm/hooks/useCrmFilterOptions";
import { formatStateDisplay } from "@/modules/users/utils";

interface CreateCrmFormValues {
  first_Name?: string;
  last_Name?: string;
  mobile: string;
  email?: string;
  pancardNumber?: string;
  buyerPreference?: string;
  isRegisteredBuyer?: string;
  stateId?: string;
  locationId?: string;
  vehicleCategoryId?: string;
  assignedStaffId?: string;
  remarks: string;
}

export function CreateCrmForm() {
  const router = useRouter();
  const [createClient, { loading }] = useMutation(CREATE_POTENTIAL_CLIENT_MUTATION);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCrmFormValues>({
    defaultValues: {
      isRegisteredBuyer: "",
      stateId: "",
      assignedStaffId: "",
      vehicleCategoryId: "",
      locationId: "",
    },
  });

  const stateId = watch("stateId") ?? "";
  const prevStateIdRef = useRef<string | undefined>(undefined);
  const filterOptions = useCrmFilterOptions(stateId);

  useEffect(() => {
    const prev = prevStateIdRef.current;
    if (prev !== undefined && prev !== stateId) {
      setValue("locationId", "");
    }
    prevStateIdRef.current = stateId;
  }, [stateId, setValue]);

  const stateFormOptions = useMemo(
    () =>
      filterOptions.stateOptions.map((option) => ({
        value: option.value,
        label: formatStateDisplay(option.label),
      })),
    [filterOptions.stateOptions]
  );

  const onSubmit = async (formData: CreateCrmFormValues) => {
    const createPotentialclientInput = {
      firstName: formData.first_Name?.trim() || undefined,
      lastName: formData.last_Name?.trim() || undefined,
      mobile: formData.mobile,
      email: formData.email?.trim() || undefined,
      pancardNo: formData.pancardNumber?.trim() || undefined,
      buyerPreference: formData.buyerPreference || undefined,
      isRegisteredBuyer:
        formData.isRegisteredBuyer === "true"
          ? true
          : formData.isRegisteredBuyer === "false"
            ? false
            : undefined,
      remarks: formData.remarks.trim(),
    };

    try {
      await createClient({
        variables: {
          createPotentialclientInput,
          assignedStaffId: formData.assignedStaffId || undefined,
          stateId: formData.stateId || undefined,
          vehicleCategoryId: formData.vehicleCategoryId || undefined,
          locationId: formData.locationId || undefined,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Potential buyer created successfully.",
        timer: 2500,
        showConfirmButton: false,
      });
      router.push(ROUTES.crm);
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (filterOptions.statesLoading) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title="Add Potential Buyer"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.crm)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Save
            </Button>
          </>
        }
      >
        <FormGrid>
          <FormField label="First Name" htmlFor="crm-first-name">
            <Input id="crm-first-name" {...register("first_Name")} />
          </FormField>

          <FormField label="Last Name" htmlFor="crm-last-name">
            <Input id="crm-last-name" {...register("last_Name")} />
          </FormField>

          <FormField
            label="Mobile Number"
            htmlFor="crm-mobile"
            required
            error={errors.mobile?.message}
          >
            <Input
              id="crm-mobile"
              {...register("mobile", {
                required: "Mobile number is required",
                validate: (value) => {
                  const digits = (value || "").replace(/\D/g, "");
                  if (!digits) return "Mobile number is required";
                  if (digits.length !== 10) return "Mobile number must be 10 digits";
                  return true;
                },
              })}
            />
          </FormField>

          <FormField label="Email" htmlFor="crm-email">
            <Input id="crm-email" type="email" {...register("email")} />
          </FormField>

          <FormField label="Pancard Number" htmlFor="crm-pancard">
            <Input id="crm-pancard" {...register("pancardNumber")} />
          </FormField>

          <FormField label="Buyer Preference" htmlFor="crm-buyer-preference">
            <Select
              id="crm-buyer-preference"
              placeholder="Select preference"
              options={[...BUYER_PREFERENCE_OPTIONS]}
              {...register("buyerPreference")}
            />
          </FormField>

          <FormField label="Is Registered Buyer" htmlFor="crm-registered-buyer">
            <Select
              id="crm-registered-buyer"
              placeholder="Select"
              options={[...IS_REGISTERED_BUYER_OPTIONS]}
              {...register("isRegisteredBuyer")}
            />
          </FormField>

          <FormField label="State" htmlFor="crm-state">
            <Select
              id="crm-state"
              placeholder="Select state"
              options={stateFormOptions}
              {...register("stateId")}
            />
          </FormField>

          <FormField label="Location" htmlFor="crm-location">
            <Select
              id="crm-location"
              placeholder={stateId ? "Select location" : "Select state first"}
              options={filterOptions.locationOptions}
              disabled={!stateId || filterOptions.locationsLoading}
              {...register("locationId")}
            />
          </FormField>

          <FormField label="Vehicle Category" htmlFor="crm-vehicle-category">
            <Select
              id="crm-vehicle-category"
              placeholder="Select category"
              options={filterOptions.vehicleCategoryOptions}
              {...register("vehicleCategoryId")}
            />
          </FormField>

          <FormField label="Assigned Staff" htmlFor="crm-assigned-staff">
            <Select
              id="crm-assigned-staff"
              placeholder="Select staff"
              options={filterOptions.staffOptions}
              {...register("assignedStaffId")}
            />
          </FormField>

          <div className="col-span-full">
            <FormField
              label="Remarks"
              htmlFor="crm-remarks"
              required
              error={errors.remarks?.message}
            >
              <Textarea
                id="crm-remarks"
                rows={4}
                {...register("remarks", { required: "Remarks is required" })}
              />
            </FormField>
          </div>
        </FormGrid>
      </FormCard>
    </form>
  );
}
