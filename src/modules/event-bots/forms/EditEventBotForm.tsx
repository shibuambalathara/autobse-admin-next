"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, FormCard, Input, Select } from "@/components/ui";
import { FormField, FormGrid, Textarea } from "@/components/forms";
import { LoadingState } from "@/components/feedback";
import {
  AUTO_EVENT_BY_ID_QUERY,
  UPDATE_AUTO_EVENT_MUTATION,
} from "@/graphql/documents/event-bots";
import { ROUTES } from "@/constants/routes";
import { convertUtcToDateTimeLocal } from "@/lib/date-format";
import { extractGraphqlError } from "@/lib/graphql-errors";
import {
  EVENT_BID_LOCK_OPTIONS,
  META_EVENT_TYPE_OPTIONS,
  META_SELLER_NAMES,
} from "@/modules/events/constants/add-event";
import { useEventFilterOptions } from "@/modules/events/hooks/useEventFilterOptions";
import type { AutoEventByIdResult, UpdateAutoEventInput } from "@/modules/event-bots/types";
import type { EventCategory, MetaEventType } from "@/modules/events/types";

interface EditEventBotFormValues {
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

interface EditEventBotFormProps {
  eventBotId: string;
}

export function EditEventBotForm({ eventBotId }: EditEventBotFormProps) {
  const router = useRouter();
  const filterOptions = useEventFilterOptions();

  const { data, loading } = useQuery<AutoEventByIdResult>(
    AUTO_EVENT_BY_ID_QUERY,
    {
      variables: { where: { id: eventBotId } },
      fetchPolicy: "network-only",
    }
  );

  const [updateAutoEvent, { loading: updating }] = useMutation(
    UPDATE_AUTO_EVENT_MUTATION
  );

  const eventBot = data?.autoEvent;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditEventBotFormValues>();

  const selectedSellerId = watch("sellerId");
  const selectedSellerName = useMemo(() => {
    return (
      filterOptions.sellerOptions.find(
        (seller) => seller.value === selectedSellerId
      )?.label?.toLowerCase() ?? ""
    );
  }, [filterOptions.sellerOptions, selectedSellerId]);

  const metaSellerSelected = isMetaSeller(selectedSellerName);
  const isCompleted = eventBot?.status === "COMPLETED";

  useEffect(() => {
    if (!eventBot) return;

    reset({
      sellerId: eventBot.sellerId,
      eventCategory: eventBot.eventCategory,
      bidLock: eventBot.bidLock ?? "unlocked",
      startDate: convertUtcToDateTimeLocal(eventBot.startDate),
      endDate: convertUtcToDateTimeLocal(eventBot.endDate),
      extraTime: String(eventBot.extraTime ?? ""),
      extraTimeTrigerIn: String(eventBot.extraTimeTrigerIn ?? ""),
      gapInBetweenVehicles: String(eventBot.gapInBetweenVehicles ?? ""),
      noOfBids: String(eventBot.noOfBids ?? ""),
      metaEventId:
        eventBot.metaEventId != null ? String(eventBot.metaEventId) : "",
      metaEventType: eventBot.metaEventType ?? undefined,
      termsAndConditions: eventBot.termsAndConditions ?? "",
    });
  }, [eventBot, reset]);

  const onSubmit = async (formData: EditEventBotFormValues) => {
    if (isCompleted) return;

    const input: UpdateAutoEventInput = {
      sellerId: formData.sellerId,
      eventCategory: formData.eventCategory,
      bidLock: formData.bidLock,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      extraTime: formData.extraTime ? Number(formData.extraTime) : null,
      extraTimeTrigerIn: formData.extraTimeTrigerIn
        ? Number(formData.extraTimeTrigerIn)
        : null,
      noOfBids: formData.noOfBids ? Number(formData.noOfBids) : null,
      gapInBetweenVehicles: metaSellerSelected
        ? null
        : formData.gapInBetweenVehicles
          ? Number(formData.gapInBetweenVehicles)
          : null,
      metaEventId: metaSellerSelected
        ? Number(formData.metaEventId)
        : null,
      metaEventType: metaSellerSelected
        ? formData.metaEventType ?? null
        : null,
      termsAndConditions: formData.termsAndConditions,
    };

    try {
      await updateAutoEvent({
        variables: {
          where: { id: eventBotId },
          input,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "EventBot updated successfully.",
      });
      router.push(ROUTES.eventBots);
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: message,
      });
    }
  };

  if (loading) {
    return <LoadingState label="Loading EventBot…" />;
  }

  if (!eventBot) {
    return (
      <p className="text-sm text-red-600">EventBot not found.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title={isCompleted ? "View EventBot" : "Edit EventBot"}
        footer={
          !isCompleted ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(ROUTES.eventBots)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={updating}>
                {updating ? "Updating..." : "Update EventBot"}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.eventBots)}
            >
              Back to EventBots
            </Button>
          )
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
              disabled={isCompleted}
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
              disabled={isCompleted}
              options={[
                { label: "Online", value: "online" },
                { label: "Open", value: "open" },
              ]}
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
              disabled={isCompleted}
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
              disabled={isCompleted}
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
              disabled={isCompleted}
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
              disabled={isCompleted}
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
              disabled={isCompleted}
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
              disabled={isCompleted}
              {...register("extraTimeTrigerIn")}
            />
          </FormField>

          {metaSellerSelected ? (
            <>
              <FormField
                label="Meta Event ID"
                htmlFor="meta-event-id"
                error={errors.metaEventId?.message}
              >
                <Input
                  id="meta-event-id"
                  type="number"
                  disabled={isCompleted}
                  {...register("metaEventId")}
                />
              </FormField>

              <FormField
                label="Meta Event Type"
                htmlFor="meta-event-type"
                error={errors.metaEventType?.message}
              >
                <Select
                  id="meta-event-type"
                  placeholder="Select type"
                  disabled={isCompleted}
                  options={META_EVENT_TYPE_OPTIONS}
                  {...register("metaEventType")}
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
                disabled={isCompleted}
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
                disabled={isCompleted}
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
