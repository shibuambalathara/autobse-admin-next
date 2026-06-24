"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import { LoadingState } from "@/components/feedback";
import {
  APPROVED_VEHICLE_TEMPLATE,
  DEALER_PROMOTION_TEMPLATE,
} from "@/modules/whatsapp/constants";
import type { WhatsappUploadFormValues } from "@/modules/whatsapp/types";
import type { useWhatsappUpload } from "@/modules/whatsapp/hooks/useWhatsappUpload";

interface WhatsappUploadFormProps {
  upload: ReturnType<typeof useWhatsappUpload>;
}

export function WhatsappUploadForm({ upload }: WhatsappUploadFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<WhatsappUploadFormValues>();

  const templateValue = watch("template");
  const isDealerPromotion = templateValue === DEALER_PROMOTION_TEMPLATE;
  const isApprovedVehicle = templateValue === APPROVED_VEHICLE_TEMPLATE;
  const hideEventField = isDealerPromotion || isApprovedVehicle;

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.template) {
        upload.setSelectedTemplate(value.template);
        if (
          value.template === DEALER_PROMOTION_TEMPLATE ||
          value.template === APPROVED_VEHICLE_TEMPLATE
        ) {
          upload.setEventId("");
        }
      }
      if (value.eventId) upload.setEventId(value.eventId || "");
      if (value.contactPerson !== undefined) {
        upload.setContactMobile(value.contactPerson ?? "");
      }
      upload.setApprovedVehicleDetails({
        headerImageUrl: value.headerImageUrl ?? "",
        registrationNumber: value.registrationNumber ?? "",
        YOM: value.YOM ?? "",
        model: value.model ?? "",
        location: value.location ?? "",
        approvedPrice: value.approvedPrice ?? "",
        contact: value.contact ?? "",
      });
      if (value.dealerContact !== undefined) {
        upload.setPromotionContact(value.dealerContact ?? "");
      }
      if (value.mobile !== undefined) {
        upload.setPromotionMobile(value.mobile ?? "");
      }
    });

    return () => subscription.unsubscribe();
  }, [upload, watch]);

  return (
    <div className="w-full max-w-sm rounded-xl border border-surface-border bg-white p-4 shadow-sm">
      <form className="space-y-4" onSubmit={handleSubmit(upload.submitUpload)}>
        <FormField
          label="Template Name"
          htmlFor="whatsapp-template"
          required
          error={errors.template?.message}
        >
          <Select
            id="whatsapp-template"
            placeholder="Select template"
            options={upload.templateOptions.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            {...register("template", { required: "Template name is required" })}
          />
        </FormField>

        {!hideEventField &&
          (upload.eventsLoading ? (
            <LoadingState label="Loading events…" />
          ) : (
            <FormField
              label="Event"
              htmlFor="whatsapp-event"
              required
              error={errors.eventId?.message}
            >
              <Select
                id="whatsapp-event"
                placeholder="Select event"
                options={upload.events.map((event) => ({
                  label: String(event.eventNo),
                  value: event.id,
                }))}
                {...register("eventId", { required: "Event is required" })}
              />
            </FormField>
          ))}

        {isDealerPromotion && (
          <>
            <FormField
              label="Autobse contact person"
              htmlFor="whatsapp-dealer-contact"
              required
              error={errors.dealerContact?.message}
            >
              <Input
                id="whatsapp-dealer-contact"
                {...register("dealerContact", {
                  required: "Contact person is required",
                })}
              />
            </FormField>
            <FormField
              label="Mobile number"
              htmlFor="whatsapp-dealer-mobile"
              required
              error={errors.mobile?.message}
            >
              <Input
                id="whatsapp-dealer-mobile"
                {...register("mobile", { required: "Mobile number is required" })}
              />
            </FormField>
          </>
        )}

        {isApprovedVehicle && (
          <>
            {(
              [
                ["headerImageUrl", "Header image URL"],
                ["registrationNumber", "Reg Number"],
                ["YOM", "YOM (Year of manufacture)"],
                ["model", "Model"],
                ["location", "Location"],
                ["approvedPrice", "Approved Price"],
                ["contact", "Contact name and number"],
              ] as const
            ).map(([name, label]) => (
              <FormField
                key={name}
                label={label}
                htmlFor={`whatsapp-${name}`}
                required
                error={errors[name]?.message}
              >
                <Input
                  id={`whatsapp-${name}`}
                  {...register(name, { required: `${label} is required` })}
                />
              </FormField>
            ))}
          </>
        )}

        <FormField
          label={
            isApprovedVehicle
              ? "Upload customer list (customer_name)"
              : "Upload Dealers List"
          }
          htmlFor="whatsapp-upload-file"
          required
          error={errors.uploadFile?.message}
        >
          <Input
            id="whatsapp-upload-file"
            type="file"
            accept=".xlsx,.xls"
            {...register("uploadFile", { required: "Excel file is required" })}
          />
        </FormField>

        {!isDealerPromotion && !isApprovedVehicle && (
          <FormField
            label="Contact person name & mobile"
            htmlFor="whatsapp-contact-person"
            required
            error={errors.contactPerson?.message}
          >
            <Input
              id="whatsapp-contact-person"
              {...register("contactPerson", {
                required: "Contact person is required",
              })}
            />
          </FormField>
        )}

        <Button type="submit" isLoading={upload.uploading} loadingText="Uploading…">
          Upload
        </Button>
      </form>
    </div>
  );
}
