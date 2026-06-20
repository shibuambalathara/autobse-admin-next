"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, FormCard, Input, Select } from "@/components/ui";
import { FormField, FormGrid, Textarea } from "@/components/forms";
import { CREATE_EVENT_MUTATION } from "@/graphql/documents/events";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import {
  ADD_EVENT_CATEGORY_OPTIONS,
  AUCTION_STATUS_OPTIONS,
  DEFAULT_EVENT_TERMS,
  EVENT_BID_LOCK_OPTIONS,
  META_EVENT_TYPE_OPTIONS,
  META_SELLER_NAMES,
} from "@/modules/events/constants/add-event";
import { EVENT_ROUTES } from "@/modules/events/constants/related-routes";
import { addEventValidation } from "@/modules/events/forms/validation";
import { useEventFilterOptions } from "@/modules/events/hooks/useEventFilterOptions";
import type {
  CreateEventInput,
  CreateEventResult,
  EventCategory,
  MetaEventType,
} from "@/modules/events/types";
import { uploadEventVehicleList } from "@/modules/events/utils/event-api";

interface AddEventFormValues {
  eventCategory: EventCategory;
  startDate: string;
  endDate: string;
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

export function AddEventForm() {
  const router = useRouter();
  const filterOptions = useEventFilterOptions();
  const [createEvent, { loading }] = useMutation<CreateEventResult>(
    CREATE_EVENT_MUTATION
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddEventFormValues>({
    defaultValues: {
      noOfBids: "10",
      status: "active",
      lockedOrNot: "unlocked",
      timeTriger: "2",
      extraTime: "2",
      gap: "2",
      conditions: DEFAULT_EVENT_TERMS,
    },
  });

  const selectedSellerId = watch("sellerName");
  const selectedSellerName = useMemo(() => {
    return (
      filterOptions.sellerOptions.find(
        (seller) => seller.value === selectedSellerId
      )?.label?.toLowerCase() ?? ""
    );
  }, [filterOptions.sellerOptions, selectedSellerId]);

  const metaSellerSelected = isMetaSeller(selectedSellerName);

  useEffect(() => {
    setValue("gap", metaSellerSelected ? "0" : "2");
  }, [metaSellerSelected, setValue]);

  const onSubmit = async (formData: AddEventFormValues) => {
    const createEventInput: CreateEventInput = {
      eventCategory: formData.eventCategory,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      noOfBids: Number(formData.noOfBids),
      status: formData.status,
      termsAndConditions: formData.conditions,
      bidLock: formData.lockedOrNot,
      extraTimeTrigerIn: Number(formData.timeTriger),
      extraTime: Number(formData.extraTime),
      gapInBetweenVehicles: Number(formData.gap),
      metaEventId: formData.metaEventId ? Number(formData.metaEventId) : null,
      autobseContactPerson: formData.autobseContactPerson || undefined,
      autobseContact: formData.autobseContact || undefined,
      metaEventType: formData.metaEventType || null,
    };

    try {
      const result = await createEvent({
        variables: {
          vehicleCategoryId: formData.eventId,
          locationId: formData.location,
          createEventInput,
          sellerId: formData.sellerName,
        },
      });

      const eventId = result.data?.createEvent?.id;
      if (!eventId) {
        throw new Error("Event creation failed. No ID returned.");
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
        text: "Event created successfully! Upload Excel now.",
        timer: 2500,
        showConfirmButton: false,
      });
      router.push(
        EVENT_ROUTES.uploadVehicles(eventId, formData.eventCategory)
      );
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title="Add Event"
        description="Create a new auction event and optionally upload the vehicle list."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.events)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Save
            </Button>
          </>
        }
      >
        <FormGrid columns={3}>
          <FormField
            label="Event Category"
            htmlFor="eventCategory"
            required
            error={errors.eventCategory?.message}
          >
            <Select
              id="eventCategory"
              placeholder="Select category"
              options={ADD_EVENT_CATEGORY_OPTIONS}
              {...register("eventCategory", addEventValidation.eventCategory)}
            />
          </FormField>

          <FormField
            label="Start Date and Time"
            htmlFor="startDate"
            required
            error={errors.startDate?.message}
          >
            <Input
              id="startDate"
              type="datetime-local"
              {...register("startDate", addEventValidation.startDate)}
            />
          </FormField>

          <FormField
            label="End Date and Time"
            htmlFor="endDate"
            required
            error={errors.endDate?.message}
          >
            <Input
              id="endDate"
              type="datetime-local"
              {...register("endDate", addEventValidation.endDate)}
            />
          </FormField>

          <FormField
            label="Seller"
            htmlFor="sellerName"
            required
            error={errors.sellerName?.message}
          >
            <Select
              id="sellerName"
              placeholder="Select seller"
              options={filterOptions.sellerOptions}
              {...register("sellerName", addEventValidation.sellerName)}
            />
          </FormField>

          <FormField
            label="Vehicle Category"
            htmlFor="eventId"
            required
            error={errors.eventId?.message}
          >
            <Select
              id="eventId"
              placeholder="Select vehicle category"
              options={filterOptions.vehicleCategoryOptions}
              {...register("eventId", addEventValidation.eventId)}
            />
          </FormField>

          <FormField
            label="Location"
            htmlFor="location"
            required
            error={errors.location?.message}
          >
            <Select
              id="location"
              placeholder="Select location"
              options={filterOptions.locationOptions}
              {...register("location", addEventValidation.location)}
            />
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
              {...register("status", addEventValidation.status)}
            />
          </FormField>

          <FormField
            label="Downloadable File"
            htmlFor="downloadable"
            error={errors.downloadable?.message as string | undefined}
          >
            <Input
              id="downloadable"
              type="file"
              accept=".xlsx,.xls,.pdf"
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
              {...register("lockedOrNot", addEventValidation.lockedOrNot)}
            />
          </FormField>

          <FormField
            label="Time Trigger (in minutes)"
            htmlFor="timeTriger"
            error={errors.timeTriger?.message}
          >
            <Input id="timeTriger" type="number" {...register("timeTriger")} />
          </FormField>

          <FormField
            label="Extra Time (in minutes)"
            htmlFor="extraTime"
            error={errors.extraTime?.message}
          >
            <Input id="extraTime" type="number" {...register("extraTime")} />
          </FormField>

          {!metaSellerSelected && (
            <FormField
              label="Gap Between Vehicles (in minutes)"
              htmlFor="gap"
              error={errors.gap?.message}
            >
              <Input id="gap" type="number" {...register("gap")} />
            </FormField>
          )}

          {metaSellerSelected && (
            <>
              <FormField
                label="Meta Event ID"
                htmlFor="metaEventId"
                required
                error={errors.metaEventId?.message}
              >
                <Input
                  id="metaEventId"
                  type="number"
                  {...register("metaEventId", addEventValidation.metaEventId)}
                />
              </FormField>

              <FormField
                label="Meta Event Type"
                htmlFor="metaEventType"
                required
                error={errors.metaEventType?.message}
              >
                <Select
                  id="metaEventType"
                  placeholder="Select meta event type"
                  options={META_EVENT_TYPE_OPTIONS}
                  {...register("metaEventType", addEventValidation.metaEventType)}
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
              {...register("autobseContact", addEventValidation.autobseContact)}
            />
          </FormField>

          <FormField
            label="Terms and Conditions"
            htmlFor="conditions"
            className="md:col-span-2 lg:col-span-3"
            error={errors.conditions?.message}
          >
            <Textarea
              id="conditions"
              rows={12}
              {...register("conditions")}
            />
          </FormField>
        </FormGrid>
      </FormCard>
    </form>
  );
}
