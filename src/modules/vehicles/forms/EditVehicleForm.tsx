"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { ArrowLeft, Pencil } from "lucide-react";
import Swal from "sweetalert2";
import { Button, FormCard, Input, PageContainer, Select } from "@/components/ui";
import { useAccess } from "@/auth/use-access";
import { PERMISSIONS } from "@/auth/permissions";
import { FormField, FormGrid, Textarea } from "@/components/forms";
import { LoadingState } from "@/components/feedback";
import {
  UPDATE_VEHICLE_MUTATION,
  VEHICLE_QUERY,
} from "@/graphql/documents/vehicles";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { AdditionalDataSection } from "@/modules/vehicles/components/AdditionalDataSection";
import { VehicleImageGallery } from "@/modules/vehicles/components/VehicleImageGallery";
import { VehicleImageUpload } from "@/modules/vehicles/components/VehicleImageUpload";
import { BID_STATUS_OPTIONS, EDIT_VEHICLE_FIELDS } from "@/modules/vehicles/constants";
import { editVehicleValidation } from "@/modules/vehicles/forms/validation";
import type { VehicleDetail } from "@/modules/vehicles/types";
import {
  buildAdditionalDataDefaults,
  createEmptyAdditionalDataState,
  mergeAdditionalData,
} from "@/modules/vehicles/utils/additional-data";
import {
  formatImageTextareaValue,
  normalizeImageTextareaValue,
  normalizeVehicleImages,
  parseAdditionalData,
} from "@/modules/vehicles/utils/vehicle-payload";
import { updateVehicleImageUrls } from "@/modules/vehicles/utils/vehicle-api";

interface EditVehicleFormValues {
  bidStatus?: string;
  regNo: string;
  loanANum: string;
  make?: string;
  model?: string;
  varient?: string;
  rcStatus?: string;
  yearOfManuFacture?: string;
  Ownership?: string;
  quoteInc?: string;
  kmReading?: string;
  startPrice?: string;
  reservePrice?: string;
  repoDate?: string;
  inspectionLink?: string;
  images?: string;
  additionalData?: Record<string, string>;
}

interface EditVehicleFormProps {
  vehicleId: string;
}

export function EditVehicleForm({ vehicleId }: EditVehicleFormProps) {
  const router = useRouter();
  const { can } = useAccess();
  const canManageVehicles = can(PERMISSIONS.VEHICLES_MANAGE);
  const [isEditable, setIsEditable] = useState(false);
  const [additionalState, setAdditionalState] = useState(createEmptyAdditionalDataState);

  const { data, loading, error, refetch } = useQuery<{ vehicle: VehicleDetail }>(
    VEHICLE_QUERY,
    { variables: { where: { id: vehicleId } } }
  );
  const [updateVehicle, { loading: saving }] = useMutation(UPDATE_VEHICLE_MUTATION);

  const methods = useForm<EditVehicleFormValues>();
  const { register, handleSubmit, reset, formState: { errors } } = methods;

  const vehicle = data?.vehicle;
  const parsedAdditionalData = useMemo(
    () => parseAdditionalData(vehicle?.additionalData),
    [vehicle?.additionalData]
  );

  const imageList = useMemo(
    () => normalizeVehicleImages(vehicle?.images),
    [vehicle?.images]
  );

  useEffect(() => {
    if (!vehicle) return;
    const additionalDefaults = buildAdditionalDataDefaults(parsedAdditionalData);
    reset({
      bidStatus: vehicle.bidStatus ?? "",
      regNo: vehicle.registrationNumber ?? "",
      loanANum: vehicle.loanAgreementNo ?? "",
      make: vehicle.make ?? "",
      model: vehicle.model ?? "",
      varient: vehicle.varient ?? "",
      rcStatus: vehicle.rcStatus ?? "",
      yearOfManuFacture: vehicle.YOM != null ? String(vehicle.YOM) : "",
      Ownership: vehicle.ownership != null ? String(vehicle.ownership) : "",
      quoteInc: vehicle.quoteIncreament != null ? String(vehicle.quoteIncreament) : "",
      kmReading: vehicle.kmReading != null ? String(vehicle.kmReading) : "",
      startPrice: vehicle.startPrice != null ? String(vehicle.startPrice) : "",
      reservePrice: vehicle.reservePrice != null ? String(vehicle.reservePrice) : "",
      repoDate: vehicle.repoDt ?? "",
      inspectionLink: vehicle.inspectionLink ?? "",
      images: formatImageTextareaValue(vehicle.images),
      ...additionalDefaults,
    });
    setAdditionalState(createEmptyAdditionalDataState());
  }, [vehicle, parsedAdditionalData, reset]);

  const onSubmit = async (formData: EditVehicleFormValues) => {
    const mergedAdditional =
      parsedAdditionalData && Object.keys(parsedAdditionalData).length > 0
        ? mergeAdditionalData({
            existing: parsedAdditionalData,
            formAdditionalData: formData.additionalData,
            keyRenames: additionalState.keyRenames,
            removedFields: additionalState.removedFields,
            newFields: additionalState.newFields,
          })
        : mergeAdditionalData({
            existing: {},
            formAdditionalData: {},
            keyRenames: {},
            removedFields: new Set(),
            newFields: additionalState.newFields,
          });

    const payload: Record<string, unknown> = {
      registrationNumber: formData.regNo?.trim() || null,
      loanAgreementNo: formData.loanANum?.trim() || null,
      make: formData.make?.trim() || null,
      model: formData.model?.trim() || null,
      varient: formData.varient?.trim() || null,
      rcStatus: formData.rcStatus || null,
      YOM: formData.yearOfManuFacture ? Number(formData.yearOfManuFacture) : null,
      ownership: formData.Ownership ? Number(formData.Ownership) : null,
      quoteIncreament: formData.quoteInc ? Number(formData.quoteInc) : null,
      kmReading: formData.kmReading ? Number(formData.kmReading) : null,
      startPrice: formData.startPrice ? Number(formData.startPrice) : 0,
      reservePrice: formData.reservePrice ? Number(formData.reservePrice) : 0,
      repoDt: formData.repoDate || null,
      inspectionLink: formData.inspectionLink || null,
    };

    const newImageUrls = normalizeImageTextareaValue(formData.images);
    const imagesChanged =
      newImageUrls.join("|") !== imageList.join("|");
    const loanNo = formData.loanANum?.trim();
    const regNo = formData.regNo?.trim();

    if (Object.keys(mergedAdditional).length > 0) {
      payload.additionalData = mergedAdditional;
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === null) delete payload[key];
    });

    try {
      await updateVehicle({
        variables: { where: { id: vehicleId }, updateVehicleInput: payload },
      });

      if (imagesChanged && loanNo && regNo) {
        await updateVehicleImageUrls(loanNo, regNo, newImageUrls);
      }

      await refetch();
      setIsEditable(false);
      await Swal.fire({
        icon: "success",
        title: "Updated",
        text: `Vehicle ${formData.regNo} updated successfully.`,
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      const { message } = extractGraphqlError(err);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (loading) return <LoadingState label="Loading vehicle…" />;
  if (error || !vehicle) {
    return (
      <p className="text-destructive">
        {error ? extractGraphqlError(error).message : "Vehicle not found."}
      </p>
    );
  }

  const eventId = vehicle.event?.id;

  const toggleEditMode = () => setIsEditable((value) => !value);

  const goBackToVehicles = () => {
    if (eventId) {
      router.push(ROUTES.eventVehicles(eventId));
      return;
    }
    router.back();
  };

  const renderEditToggleButton = () =>
    canManageVehicles ? (
      <Button
        type="button"
        size="sm"
        variant={isEditable ? "secondary" : "outline"}
        onClick={toggleEditMode}
      >
        <Pencil className="h-4 w-4" />
        {isEditable ? "Cancel Edit" : "Edit"}
      </Button>
    ) : null;

  return (
    <PageContainer
      title="Edit Vehicle"
      description="View and update vehicle details."
      actions={
        !isEditable ? (
          <Button type="button" size="sm" variant="outline" onClick={goBackToVehicles}>
            <ArrowLeft className="h-4 w-4" />
            Back to Vehicles
          </Button>
        ) : undefined
      }
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormCard
            title="Vehicle Details"
            description={
              vehicle.event?.seller?.name
                ? `Seller: ${vehicle.event.seller.name}`
                : undefined
            }
            actions={renderEditToggleButton()}
            footer={
              canManageVehicles && isEditable ? (
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Update"}
                </Button>
              ) : undefined
            }
          >
          <FormGrid columns={3}>
            <FormField label="Bid Status" htmlFor="bidStatus">
              <Select
                id="bidStatus"
                disabled
                options={BID_STATUS_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
                value={vehicle.bidStatus ?? ""}
                onChange={() => undefined}
              />
            </FormField>

            {EDIT_VEHICLE_FIELDS.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                htmlFor={field.name}
                required={"required" in field && field.required}
                error={
                  (errors as Record<string, { message?: string } | undefined>)[
                    field.name
                  ]?.message
                }
              >
                <Input
                  id={field.name}
                  type={field.type}
                  disabled={!isEditable}
                  {...register(
                    field.name as keyof EditVehicleFormValues,
                    "required" in field && field.required
                      ? editVehicleValidation[
                          field.name as keyof typeof editVehicleValidation
                        ]
                      : undefined
                  )}
                />
              </FormField>
            ))}

            <AdditionalDataSection
              additionalData={parsedAdditionalData}
              isEditable={canManageVehicles && isEditable}
              state={additionalState}
              onStateChange={setAdditionalState}
            />

            {imageList.length > 0 && vehicle.loanAgreementNo && vehicle.registrationNumber && (
              <VehicleImageGallery
                images={imageList}
                loanAgreementNo={vehicle.loanAgreementNo}
                registrationNumber={vehicle.registrationNumber}
              />
            )}

            <FormField label="Image URLs" htmlFor="images" className="col-span-full">
              <Textarea
                id="images"
                rows={6}
                disabled={!isEditable}
                {...register("images")}
              />
            </FormField>

            {vehicle.loanAgreementNo && vehicle.registrationNumber && (
              <VehicleImageUpload
                isEditable={canManageVehicles && isEditable}
                loanAgreementNo={vehicle.loanAgreementNo}
                registrationNumber={vehicle.registrationNumber}
              />
            )}
          </FormGrid>
        </FormCard>
        </form>
      </FormProvider>
    </PageContainer>
  );
}
