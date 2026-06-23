"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, FormCard, Input, Select } from "@/components/ui";
import { FormField, FormGrid, Textarea } from "@/components/forms";
import { LoadingState } from "@/components/feedback";
import {
  INDIVIDUAL_CRM_QUERY,
  UPDATE_CRM_MUTATION,
} from "@/graphql/documents/crm";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import {
  BUYER_PREFERENCE_OPTIONS,
  IS_REGISTERED_BUYER_OPTIONS,
  POTENTIAL_CLIENT_STATUS_OPTIONS,
} from "@/modules/crm/constants";
import { useCrmFilterOptions } from "@/modules/crm/hooks/useCrmFilterOptions";
import type { IndividualCrmResult } from "@/modules/crm/types";
import { formatStateDisplay } from "@/modules/users/utils";

interface EditCrmFormValues {
  first_Name?: string;
  last_Name?: string;
  mobile: string;
  email?: string;
  pancardNumber?: string;
  buyerPreference?: string;
  isRegisteredBuyer?: string;
  status?: string;
  stateId?: string;
  locationId?: string;
  vehicleCategoryId?: string;
  assignedStaffId?: string;
  remarks?: string;
}

interface EditCrmFormProps {
  clientId: string;
  isEditable: boolean;
  onToggleEdit: () => void;
}

export function EditCrmForm({ clientId, isEditable, onToggleEdit }: EditCrmFormProps) {
  const router = useRouter();

  const { data, loading, error } = useQuery<IndividualCrmResult>(
    INDIVIDUAL_CRM_QUERY,
    {
      variables: { where: { id: clientId } },
      skip: !clientId,
      fetchPolicy: "network-only",
    }
  );

  const [updateClient, { loading: updating }] = useMutation(UPDATE_CRM_MUTATION);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditCrmFormValues>();

  const client = data?.potentialClient;
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

  const resetToClientValues = () => {
    if (!client) return;
    reset({
      first_Name: client.firstName ?? "",
      last_Name: client.lastName ?? "",
      mobile: client.mobile ?? "",
      email: client.email ?? "",
      pancardNumber: client.pancardNo ?? "",
      buyerPreference: client.buyerPreference ?? "",
      isRegisteredBuyer:
        client.isRegisteredBuyer === true
          ? "true"
          : client.isRegisteredBuyer === false
            ? "false"
            : "",
      status: client.status ?? "",
      remarks: client.remarks ?? "",
      assignedStaffId:
        client.assignedStaffId ?? client.assignedStaff?.id ?? "",
      stateId: client.stateId ?? "",
      vehicleCategoryId:
        client.vehicleCategoryId ?? client.vehicleCategory?.id ?? "",
      locationId: client.locationId ?? client.location?.id ?? "",
    });
  };

  useEffect(() => {
    resetToClientValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const staffOptions = useMemo(() => {
    const activeStaff = [...filterOptions.staffOptions];
    const assigned = client?.assignedStaff;
    if (
      assigned?.id &&
      !activeStaff.some((option) => option.value === assigned.id)
    ) {
      activeStaff.push({
        value: assigned.id,
        label:
          [assigned.firstName, assigned.lastName].filter(Boolean).join(" ") ||
          assigned.id,
      });
    }
    return activeStaff;
  }, [filterOptions.staffOptions, client]);

  const locationOptions = useMemo(() => {
    const stateLocations = [...filterOptions.locationOptions];
    const currentLocation = client?.location;
    if (
      currentLocation?.id &&
      !stateLocations.some((option) => option.value === currentLocation.id)
    ) {
      stateLocations.push({
        value: currentLocation.id,
        label: currentLocation.name ?? currentLocation.id,
      });
    }
    return stateLocations;
  }, [filterOptions.locationOptions, client]);

  const stateFormOptions = useMemo(
    () =>
      filterOptions.stateOptions.map((option) => ({
        value: option.value,
        label: formatStateDisplay(option.label),
      })),
    [filterOptions.stateOptions]
  );

  const onSubmit = async (formData: EditCrmFormValues) => {
    if (!isEditable) return;

    const updatePotentialclientInput = {
      firstName: (formData.first_Name ?? "").trim(),
      lastName: (formData.last_Name ?? "").trim(),
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
      remarks: (formData.remarks ?? "").trim(),
      assignedStaffId: formData.assignedStaffId || undefined,
      stateId: formData.stateId || undefined,
      vehicleCategoryId: formData.vehicleCategoryId || undefined,
      locationId: formData.locationId || undefined,
      status: formData.status || undefined,
    };

    try {
      await updateClient({
        variables: {
          where: { id: clientId },
          updatePotentialclientInput,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Potential buyer updated successfully.",
        timer: 2500,
        showConfirmButton: false,
      });
      onToggleEdit();
      router.push(ROUTES.crm);
    } catch (err: unknown) {
      const { message } = extractGraphqlError(err);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (loading || filterOptions.statesLoading || !client) {
    return <LoadingState label="Loading potential buyer…" />;
  }

  if (error) {
    return (
      <p className="text-destructive">{extractGraphqlError(error).message}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title="Edit Potential Buyer"
        description={`SL No: ${client.idNo}`}
        footer={
          isEditable ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(ROUTES.crm)}
              >
                Back
              </Button>
              <Button type="submit" isLoading={updating}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.crm)}
            >
              Back to CRM
            </Button>
          )
        }
      >
        <fieldset disabled={!isEditable} className="min-w-0 border-0 p-0">
          <FormGrid>
            <FormField label="First Name" htmlFor="edit-crm-first-name">
              <Input id="edit-crm-first-name" {...register("first_Name")} />
            </FormField>

            <FormField label="Last Name" htmlFor="edit-crm-last-name">
              <Input id="edit-crm-last-name" {...register("last_Name")} />
            </FormField>

            <FormField
              label="Mobile Number"
              htmlFor="edit-crm-mobile"
              required
              error={errors.mobile?.message}
            >
              <Input
                id="edit-crm-mobile"
                {...register("mobile", {
                  required: "Mobile number is required",
                  minLength: { value: 10, message: "Must be 10 digits" },
                  maxLength: { value: 10, message: "Must be 10 digits" },
                })}
              />
            </FormField>

            <FormField label="Email" htmlFor="edit-crm-email">
              <Input id="edit-crm-email" type="email" {...register("email")} />
            </FormField>

            <FormField label="Pancard Number" htmlFor="edit-crm-pancard">
              <Input id="edit-crm-pancard" {...register("pancardNumber")} />
            </FormField>

            <FormField
              label="Status"
              htmlFor="edit-crm-status"
              required
              error={errors.status?.message}
            >
              <Select
                id="edit-crm-status"
                placeholder="Select status"
                options={[...POTENTIAL_CLIENT_STATUS_OPTIONS]}
                {...register("status", { required: "Status is required" })}
              />
            </FormField>

            <FormField label="Buyer Preference" htmlFor="edit-crm-buyer-preference">
              <Select
                id="edit-crm-buyer-preference"
                placeholder="Select preference"
                options={[...BUYER_PREFERENCE_OPTIONS]}
                {...register("buyerPreference")}
              />
            </FormField>

            <FormField label="Is Registered Buyer" htmlFor="edit-crm-registered-buyer">
              <Select
                id="edit-crm-registered-buyer"
                placeholder="Select"
                options={[...IS_REGISTERED_BUYER_OPTIONS]}
                {...register("isRegisteredBuyer")}
              />
            </FormField>

            <FormField label="State" htmlFor="edit-crm-state">
              <Select
                id="edit-crm-state"
                placeholder="Select state"
                options={stateFormOptions}
                {...register("stateId")}
              />
            </FormField>

            <FormField label="Location" htmlFor="edit-crm-location">
              <Select
                id="edit-crm-location"
                placeholder={stateId ? "Select location" : "Select state first"}
                options={locationOptions}
                disabled={!stateId || filterOptions.locationsLoading}
                {...register("locationId")}
              />
            </FormField>

            <FormField label="Vehicle Category" htmlFor="edit-crm-vehicle-category">
              <Select
                id="edit-crm-vehicle-category"
                placeholder="Select category"
                options={filterOptions.vehicleCategoryOptions}
                {...register("vehicleCategoryId")}
              />
            </FormField>

            <FormField label="Assigned Staff" htmlFor="edit-crm-assigned-staff">
              <Select
                id="edit-crm-assigned-staff"
                placeholder="Select staff"
                options={staffOptions}
                {...register("assignedStaffId")}
              />
            </FormField>

            <div className="col-span-full">
              <FormField label="Remarks" htmlFor="edit-crm-remarks">
                <Textarea id="edit-crm-remarks" rows={4} {...register("remarks")} />
              </FormField>
            </div>
          </FormGrid>
        </fieldset>
      </FormCard>
    </form>
  );
}
