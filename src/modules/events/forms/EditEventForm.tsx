"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { useAccess } from "@/auth/use-access";
import { PERMISSIONS } from "@/auth/permissions";
import { Button, FormCard, Input, Select } from "@/components/ui";
import { FormField, FormGrid, Textarea } from "@/components/forms";
import { LoadingState } from "@/components/feedback";
import { UPDATE_EVENT_MUTATION } from "@/graphql/documents/events";
import { ROUTES } from "@/constants/routes";
import { convertUtcToDateTimeLocal } from "@/lib/date-format";
import { extractGraphqlError } from "@/lib/graphql-errors";
import {
  ADD_EVENT_CATEGORY_OPTIONS,
  AUCTION_STATUS_OPTIONS,
  EVENT_BID_LOCK_OPTIONS,
  META_EVENT_TYPE_OPTIONS,
  META_SELLER_NAMES,
} from "@/modules/events/constants/add-event";
import { addEventValidation } from "@/modules/events/forms/validation";
import { useEventDetail } from "@/modules/events/hooks/useEventDetail";
import { useEventFilterOptions } from "@/modules/events/hooks/useEventFilterOptions";
import type {
  EventCategory,
  EventDetail,
  MetaEventType,
  UpdateEventInput,
  UpdateEventResult,
} from "@/modules/events/types";
import { uploadEventVehicleList } from "@/modules/events/utils/event-api";

interface EditEventFormValues {
  eventCategory: EventCategory;
  startDate: string;
  firstVehicleEndDate: string;
  sellerName: string;
  eventId: string;
  location: string;
  noOfBids: string;
  status: string;
  downloadable?: FileList;
  lockedOrNot: string;
  timeTriger: string;
  extraTime: string;
  gap: string;
  metaEventId?: string;
  metaEventType?: MetaEventType;
  autobseContactPerson?: string;
  autobseContact?: string;
  conditions: string;
}

function isMetaSeller(sellerName: string): boolean {
  return META_SELLER_NAMES.some((name) => name === sellerName.toLowerCase());
}

function mapEventToFormValues(event: EventDetail): EditEventFormValues {
  return {
    eventCategory: event.eventCategory,
    startDate: convertUtcToDateTimeLocal(event.startDate),
    firstVehicleEndDate: convertUtcToDateTimeLocal(event.firstVehicleEndDate),
    sellerName: event.sellerId,
    eventId: event.vehicleCategoryId,
    location: event.locationId,
    noOfBids: String(event.noOfBids),
    status: event.status ?? "active",
    lockedOrNot: event.bidLock ?? "unlocked",
    timeTriger: String(event.extraTimeTrigerIn ?? ""),
    extraTime: String(event.extraTime ?? ""),
    gap: String(event.gapInBetweenVehicles ?? ""),
    metaEventId: event.metaEventId ? String(event.metaEventId) : "",
    metaEventType: event.metaEventType ?? undefined,
    autobseContactPerson: event.autobseContactPerson ?? "",
    autobseContact: event.autobseContact ?? "",
    conditions: event.termsAndConditions ?? "",
  };
}

interface EditEventFormProps {
  eventId: string;
}

export function EditEventForm({ eventId }: EditEventFormProps) {
  const router = useRouter();
  const { can } = useAccess();
  const canManageEvents = can(PERMISSIONS.EVENTS_MANAGE);
  const filterOptions = useEventFilterOptions(canManageEvents);
  const { event, loading, error } = useEventDetail(eventId);
  const [updateEvent, { loading: saving }] = useMutation<UpdateEventResult>(
    UPDATE_EVENT_MUTATION
  );
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditEventFormValues>();

  useEffect(() => {
    if (event) {
      reset(mapEventToFormValues(event));
    }
  }, [event, reset]);

  const selectedSellerId = watch("sellerName");
  const selectedSellerName = useMemo(() => {
    return (
      filterOptions.sellerOptions.find(
        (seller) => seller.value === selectedSellerId
      )?.label?.toLowerCase() ?? ""
    );
  }, [filterOptions.sellerOptions, selectedSellerId]);

  const metaSellerSelected = isMetaSeller(selectedSellerName);
  const readOnly = !canManageEvents;

  const onSubmit = async (formData: EditEventFormValues) => {
    if (!canManageEvents) return;
    const updateEventInput: UpdateEventInput = {
      eventCategory: formData.eventCategory,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.firstVehicleEndDate).toISOString(),
      noOfBids: Number(formData.noOfBids),
      sellerId: formData.sellerName,
      vehicleCategoryId: formData.eventId,
      locationId: formData.location,
      status: formData.status,
      termsAndConditions: formData.conditions,
      bidLock: formData.lockedOrNot,
      metaEventId: formData.metaEventId ? Number(formData.metaEventId) : null,
      autobseContactPerson: formData.autobseContactPerson || undefined,
      autobseContact: formData.autobseContact || undefined,
      metaEventType: formData.metaEventType || null,
    };

    try {
      const result = await updateEvent({
        variables: {
          where: { id: eventId },
          updateEventInput,
        },
      });

      if (!result.data?.updateEvent?.id) {
        throw new Error("Event update failed. No ID returned.");
      }

      const file = formData.downloadable?.[0];
      if (file) {
        await uploadEventVehicleList(eventId, file);
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Excel file added successfully!",
          timer: 2500,
          showConfirmButton: false,
        });
        router.push(ROUTES.events);
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Event updated successfully!",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (submitError: unknown) {
      const { message } = extractGraphqlError(submitError);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (loading && !error) {
    return <LoadingState label="Loading event…" />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {extractGraphqlError(error).message}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Event not found.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title={`${canManageEvents ? "Edit" : "View"} Event No: ${event.eventNo}`}
        description={
          canManageEvents
            ? "Update auction event details and optionally replace the vehicle list file."
            : "View auction event details. Only admin and staff can make changes."
        }
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.events)}
            >
              {canManageEvents ? "Cancel" : "Back"}
            </Button>
            {canManageEvents ? (
              <Button type="submit" isLoading={saving}>
                Save Changes
              </Button>
            ) : null}
          </>
        }
      >
        <FormGrid columns={3}>
          <FormField
            label="Event Category"
            htmlFor="eventCategory"
            error={errors.eventCategory?.message}
          >
            <Select
              id="eventCategory"
              options={ADD_EVENT_CATEGORY_OPTIONS}
              disabled
              {...register("eventCategory")}
            />
          </FormField>

          <FormField
            label="Start Date and Time"
            htmlFor="startDate"
            error={errors.startDate?.message}
          >
            <Input
              id="startDate"
              type="datetime-local"
              disabled={readOnly}
              {...register("startDate")}
            />
          </FormField>

          <FormField
            label="First Vehicle End Time"
            htmlFor="firstVehicleEndDate"
            required
            error={errors.firstVehicleEndDate?.message}
          >
            <Input
              id="firstVehicleEndDate"
              type="datetime-local"
              disabled={readOnly}
              {...register("firstVehicleEndDate", {
                required: "First vehicle end time is required",
              })}
            />
          </FormField>

          <FormField
            label="Seller"
            htmlFor="sellerName"
            required={canManageEvents}
            error={errors.sellerName?.message}
          >
            {readOnly ? (
              <Input
                id="sellerName"
                value={event.seller?.name ?? "—"}
                disabled
                readOnly
              />
            ) : (
              <Select
                id="sellerName"
                placeholder="Select seller"
                options={filterOptions.sellerOptions}
                {...register("sellerName", addEventValidation.sellerName)}
              />
            )}
          </FormField>

          <FormField
            label="Vehicle Category"
            htmlFor="eventId"
            required={canManageEvents}
            error={errors.eventId?.message}
          >
            {readOnly ? (
              <Input
                id="eventId"
                value={event.vehicleCategory?.name ?? "—"}
                disabled
                readOnly
              />
            ) : (
              <Select
                id="eventId"
                placeholder="Select vehicle category"
                options={filterOptions.vehicleCategoryOptions}
                {...register("eventId", addEventValidation.eventId)}
              />
            )}
          </FormField>

          <FormField
            label="Location"
            htmlFor="location"
            required={canManageEvents}
            error={errors.location?.message}
          >
            {readOnly ? (
              <Input
                id="location"
                value={event.location?.name ?? "—"}
                disabled
                readOnly
              />
            ) : (
              <Select
                id="location"
                placeholder="Select location"
                options={filterOptions.locationOptions}
                {...register("location", addEventValidation.location)}
              />
            )}
          </FormField>

          <FormField
            label="Number of Bids (per User)"
            htmlFor="noOfBids"
            required
            error={errors.noOfBids?.message}
          >
            <Input
              id="noOfBids"
              type="number"
              disabled={readOnly}
              {...register("noOfBids", addEventValidation.noOfBids)}
            />
          </FormField>

          <FormField
            label="Auction Status"
            htmlFor="status"
            required
            error={errors.status?.message}
          >
            <Select
              id="status"
              options={AUCTION_STATUS_OPTIONS}
              disabled={readOnly}
              {...register("status", addEventValidation.status)}
            />
          </FormField>

          <FormField
            label="Downloadable File"
            htmlFor="downloadable"
            hint={
              event.downloadableFile_filename
                ? `Current file: ${event.downloadableFile_filename}`
                : undefined
            }
            error={errors.downloadable?.message as string | undefined}
          >
            <Input
              id="downloadable"
              type="file"
              accept=".xlsx,.xls,.pdf"
              disabled={readOnly}
              {...register("downloadable")}
            />
          </FormField>

          <FormField
            label="Bid Lock"
            htmlFor="lockedOrNot"
            required
            error={errors.lockedOrNot?.message}
          >
            <Select
              id="lockedOrNot"
              options={EVENT_BID_LOCK_OPTIONS}
              disabled={readOnly}
              {...register("lockedOrNot", addEventValidation.lockedOrNot)}
            />
          </FormField>

          <FormField
            label="Time Trigger (in minutes)"
            htmlFor="timeTriger"
            error={errors.timeTriger?.message}
          >
            <Input
              id="timeTriger"
              type="number"
              disabled
              {...register("timeTriger")}
            />
          </FormField>

          <FormField
            label="Extra Time (in minutes)"
            htmlFor="extraTime"
            error={errors.extraTime?.message}
          >
            <Input
              id="extraTime"
              type="number"
              disabled
              {...register("extraTime")}
            />
          </FormField>

          {!metaSellerSelected && (
            <FormField
              label="Gap Between Vehicles (in minutes)"
              htmlFor="gap"
              error={errors.gap?.message}
            >
              <Input id="gap" type="number" disabled {...register("gap")} />
            </FormField>
          )}

          {metaSellerSelected && (
            <>
              <FormField
                label="Meta Event ID"
                htmlFor="metaEventId"
                error={errors.metaEventId?.message}
              >
                <Input
                  id="metaEventId"
                  type="number"
                  disabled={readOnly}
                  {...register("metaEventId", {
                    ...addEventValidation.metaEventId,
                    required: false,
                  })}
                />
              </FormField>

              <FormField
                label="Meta Event Type"
                htmlFor="metaEventType"
                error={errors.metaEventType?.message}
              >
                <Select
                  id="metaEventType"
                  placeholder="Select meta event type"
                  options={META_EVENT_TYPE_OPTIONS}
                  disabled={readOnly}
                  {...register("metaEventType", {
                    ...addEventValidation.metaEventType,
                    required: false,
                  })}
                />
              </FormField>
            </>
          )}

          <FormField
            label="Autobse Contact Person"
            htmlFor="autobseContactPerson"
            error={errors.autobseContactPerson?.message}
          >
            <Input
              id="autobseContactPerson"
              disabled={readOnly}
              {...register("autobseContactPerson")}
            />
          </FormField>

          <FormField
            label="Autobse Contact Number"
            htmlFor="autobseContact"
            error={errors.autobseContact?.message}
          >
            <Input
              id="autobseContact"
              disabled={readOnly}
              {...register("autobseContact", addEventValidation.autobseContact)}
            />
          </FormField>

          <FormField
            label="Terms and Conditions"
            htmlFor="conditions"
            className="md:col-span-2 lg:col-span-3"
            error={errors.conditions?.message}
          >
            <Textarea id="conditions" rows={12} disabled={readOnly} {...register("conditions")} />
          </FormField>
        </FormGrid>
      </FormCard>
    </form>
  );
}
