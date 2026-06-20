"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, FormCard, Input, Select } from "@/components/ui";
import { FormField, FormGrid, Textarea } from "@/components/forms";
import { CREATE_AUTO_EVENT_MUTATION } from "@/graphql/documents/event-bots";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import {
  ADD_EVENT_CATEGORY_OPTIONS,
  DEFAULT_EVENT_TERMS,
  EVENT_BID_LOCK_OPTIONS,
  META_EVENT_TYPE_OPTIONS,
  META_SELLER_NAMES,
} from "@/modules/events/constants/add-event";
import { useEventFilterOptions } from "@/modules/events/hooks/useEventFilterOptions";
import type {
  CreateAutoEventInput,
  CreateAutoEventResult,
} from "@/modules/event-bots/types";
import type { EventCategory, MetaEventType } from "@/modules/events/types";

interface CreateEventBotFormValues {
  sellerId: string;
  eventCategory: EventCategory;
  bidLock: string;
  startDate: string;
  endDate: string;
  extraTime: string;
  extraTimeTrigerIn: string;
  gapInBetweenVehicles: string;
  noOfBids: string;
  metaEventId?: string;
  metaEventType?: MetaEventType;
  termsAndConditions: string;
}

function isMetaSeller(sellerName: string): boolean {
  return META_SELLER_NAMES.some((name) => name === sellerName.toLowerCase());
}

export function CreateEventBotForm() {
  const router = useRouter();
  const filterOptions = useEventFilterOptions();
  const [createAutoEvent, { loading }] = useMutation<CreateAutoEventResult>(
    CREATE_AUTO_EVENT_MUTATION
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateEventBotFormValues>({
    defaultValues: {
      eventCategory: "online",
      bidLock: "unlocked",
      noOfBids: "10",
      extraTime: "2",
      extraTimeTrigerIn: "2",
      gapInBetweenVehicles: "2",
      termsAndConditions: DEFAULT_EVENT_TERMS,
    },
  });

  const selectedSellerId = watch("sellerId");
  const selectedSellerName = useMemo(() => {
    return (
      filterOptions.sellerOptions.find(
        (seller) => seller.value === selectedSellerId
      )?.label?.toLowerCase() ?? ""
    );
  }, [filterOptions.sellerOptions, selectedSellerId]);

  const metaSellerSelected = isMetaSeller(selectedSellerName);

  useEffect(() => {
    setValue("gapInBetweenVehicles", metaSellerSelected ? "0" : "2");
  }, [metaSellerSelected, setValue]);

  const onSubmit = async (formData: CreateEventBotFormValues) => {
    const input: CreateAutoEventInput = {
      eventCategory: formData.eventCategory,
      bidLock: formData.bidLock,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      extraTime: Number(formData.extraTime),
      extraTimeTrigerIn: Number(formData.extraTimeTrigerIn),
      noOfBids: Number(formData.noOfBids),
      gapInBetweenVehicles: metaSellerSelected
        ? 0
        : Number(formData.gapInBetweenVehicles),
      metaEventId: metaSellerSelected
        ? Number(formData.metaEventId)
        : null,
      metaEventType: metaSellerSelected ? formData.metaEventType ?? null : null,
      termsAndConditions: formData.termsAndConditions,
    };

    try {
      const result = await createAutoEvent({
        variables: {
          sellerId: formData.sellerId,
          input,
        },
      });

      const eventId = result.data?.AutoEventCreation;
      if (!eventId) {
        throw new Error("EventBot was not created.");
      }

      await Swal.fire({
        icon: "success",
        title: "EventBot Generated!",
        text: "EventBot created successfully.",
        confirmButtonColor: "#1e40af",
      });

      router.push(ROUTES.eventBotUpload(eventId));
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({
        icon: "error",
        title: "Failed!",
        text: message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title="EventBot Details"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.eventBots)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} disabled={!selectedSellerId}>
              {loading ? "Generating..." : "EventBot Generate"}
            </Button>
          </>
        }
      >
        <FormGrid>
          <FormField
            label="Seller"
            htmlFor="seller-id"
            required
            error={errors.sellerId?.message}
          >
            <Select
              id="seller-id"
              placeholder="Select seller"
              options={filterOptions.sellerOptions}
              error={Boolean(errors.sellerId)}
              {...register("sellerId", { required: "Seller is required" })}
            />
          </FormField>

          <FormField
            label="Event Category"
            htmlFor="event-category"
            required
            error={errors.eventCategory?.message}
          >
            <Select
              id="event-category"
              options={ADD_EVENT_CATEGORY_OPTIONS.filter(
                (option) => option.value !== "auctionReport"
              )}
              error={Boolean(errors.eventCategory)}
              {...register("eventCategory", {
                required: "Event category is required",
              })}
            />
          </FormField>

          <FormField
            label="Bid Lock"
            htmlFor="bid-lock"
            required
            error={errors.bidLock?.message}
          >
            <Select
              id="bid-lock"
              options={EVENT_BID_LOCK_OPTIONS}
              error={Boolean(errors.bidLock)}
              {...register("bidLock", { required: "Bid lock is required" })}
            />
          </FormField>

          <FormField
            label="Number of Bids"
            htmlFor="no-of-bids"
            error={errors.noOfBids?.message}
          >
            <Input
              id="no-of-bids"
              type="number"
              {...register("noOfBids")}
            />
          </FormField>

          <FormField
            label="Start Date"
            htmlFor="start-date"
            required
            error={errors.startDate?.message}
          >
            <Input
              id="start-date"
              type="datetime-local"
              error={Boolean(errors.startDate)}
              {...register("startDate", { required: "Start date is required" })}
            />
          </FormField>

          <FormField
            label="End Date"
            htmlFor="end-date"
            required
            error={errors.endDate?.message}
          >
            <Input
              id="end-date"
              type="datetime-local"
              error={Boolean(errors.endDate)}
              {...register("endDate", { required: "End date is required" })}
            />
          </FormField>

          <FormField
            label="Extra Time (Minutes)"
            htmlFor="extra-time"
            error={errors.extraTime?.message}
          >
            <Input
              id="extra-time"
              type="number"
              {...register("extraTime")}
            />
          </FormField>

          <FormField
            label="Extra Time Trigger In"
            htmlFor="extra-time-trigger"
            error={errors.extraTimeTrigerIn?.message}
          >
            <Input
              id="extra-time-trigger"
              type="number"
              {...register("extraTimeTrigerIn")}
            />
          </FormField>

          {metaSellerSelected ? (
            <>
              <FormField
                label="Meta Event ID"
                htmlFor="meta-event-id"
                required
                error={errors.metaEventId?.message}
              >
                <Input
                  id="meta-event-id"
                  type="number"
                  error={Boolean(errors.metaEventId)}
                  {...register("metaEventId", {
                    required: "Meta Event ID is required",
                  })}
                />
              </FormField>

              <FormField
                label="Meta Event Type"
                htmlFor="meta-event-type"
                required
                error={errors.metaEventType?.message}
              >
                <Select
                  id="meta-event-type"
                  placeholder="Select type"
                  options={META_EVENT_TYPE_OPTIONS}
                  error={Boolean(errors.metaEventType)}
                  {...register("metaEventType", {
                    required: "Meta Event Type is required",
                  })}
                />
              </FormField>
            </>
          ) : (
            <FormField
              label="Gap Between Vehicles"
              htmlFor="gap"
              error={errors.gapInBetweenVehicles?.message}
            >
              <Input
                id="gap"
                type="number"
                {...register("gapInBetweenVehicles")}
              />
            </FormField>
          )}

          <div className="col-span-full">
            <FormField
              label="Terms & Conditions"
              htmlFor="terms"
              required
              error={errors.termsAndConditions?.message}
            >
              <Textarea
                id="terms"
                rows={8}
                error={Boolean(errors.termsAndConditions)}
                {...register("termsAndConditions", {
                  required: "Terms & conditions are required",
                })}
              />
            </FormField>
          </div>
        </FormGrid>
      </FormCard>
    </form>
  );
}
