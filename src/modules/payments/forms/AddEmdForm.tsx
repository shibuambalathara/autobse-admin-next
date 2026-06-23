"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, FormCard, Input, Select, buttonVariants } from "@/components/ui";
import { FormField } from "@/components/forms";
import { LoadingState } from "@/components/feedback";
import {
  CREATE_EMD_UPDATE_MUTATION,
  PAYMENT_QUERY,
} from "@/graphql/documents/payments";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { resolvePaymentImageUrl } from "@/modules/payments/utils/payment-api";

interface AddEmdFormProps {
  paymentId: string;
}

interface AddEmdFormValues {
  buyingLimit: number;
}

export function AddEmdForm({ paymentId }: AddEmdFormProps) {
  const router = useRouter();
  const [adjustmentType, setAdjustmentType] = useState("Increment");
  const [currentLimit, setCurrentLimit] = useState(0);

  const { data, loading } = useQuery(PAYMENT_QUERY, {
    variables: { where: { id: paymentId } },
  });

  const [createEmdUpdate, { loading: saving }] = useMutation(
    CREATE_EMD_UPDATE_MUTATION
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddEmdFormValues>();

  const payment = data?.payment;

  useEffect(() => {
    if (payment?.user?.vehicleBuyingLimit != null) {
      setCurrentLimit(payment.user.vehicleBuyingLimit);
    }
  }, [payment]);

  const onSubmit = async (formData: AddEmdFormValues) => {
    if (!payment?.userId) return;

    if (!adjustmentType) {
      await Swal.fire({
        icon: "error",
        title: "Selection required",
        text: "Please select increment or decrement.",
      });
      return;
    }

    const amount = Number(formData.buyingLimit);
    if (adjustmentType === "Decrement" && currentLimit - amount < 0) {
      await Swal.fire({
        icon: "error",
        title: "Invalid decrement",
        text: `Cannot decrement buying limit below current limit: ${currentLimit}`,
      });
      return;
    }

    const confirmed = await Swal.fire({
      title: "Save Changes Confirmation",
      html: `Are you sure you want to <span style="color: red;">${adjustmentType}</span> current buying limit by ${amount}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel!",
    });

    if (!confirmed.isConfirmed) return;

    const incrementValue =
      adjustmentType === "Decrement" ? -amount : amount;

    try {
      await createEmdUpdate({
        variables: {
          paymentId,
          userId: payment.userId,
          createEmdupdateInput: {
            vehicleBuyingLimitIncrement: incrementValue,
          },
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Buying limit updated",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push(ROUTES.users);
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (loading && !payment) {
    return <LoadingState label="Loading payment…" />;
  }

  const imageUrl = resolvePaymentImageUrl(payment?.image);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title="Buying Limit"
        footer={
          <div className="flex flex-wrap gap-2">
            <Link href={ROUTES.payments} className={buttonVariants({ variant: "outline" })}>
              Cancel
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="First Name" htmlFor="emd-first-name">
            <Input id="emd-first-name" value={payment?.user?.firstName ?? ""} disabled readOnly />
          </FormField>
          <FormField label="Current Buying Limit" htmlFor="emd-current-limit">
            <Input id="emd-current-limit" value={String(currentLimit)} disabled readOnly />
          </FormField>
          <FormField label="Amount" htmlFor="emd-amount">
            <Input id="emd-amount" value={String(payment?.amount ?? "")} disabled readOnly />
          </FormField>
          <FormField label="Payment For" htmlFor="emd-payment-for">
            <Input id="emd-payment-for" value={payment?.paymentFor ?? "emd"} disabled readOnly />
          </FormField>

          <FormField label="Select Increment/Decrement" htmlFor="emd-adjustment">
            <Select
              id="emd-adjustment"
              options={[
                { label: "Select", value: "" },
                { label: "Increment", value: "Increment" },
                ...(currentLimit > 0
                  ? [{ label: "Decrement", value: "Decrement" }]
                  : []),
              ]}
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value)}
            />
          </FormField>

          <FormField
            label={`${adjustmentType || "Adjust"} Vehicle Buying Limit`}
            htmlFor="emd-buying-limit"
            error={errors.buyingLimit?.message}
          >
            <Input
              id="emd-buying-limit"
              type="number"
              min={1}
              {...register("buyingLimit", {
                required: "Buying limit is required",
                valueAsNumber: true,
                validate: (value) =>
                  value > 0 || "Only positive integers are allowed",
              })}
            />
          </FormField>

          {imageUrl && (
            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-medium">Payment Proof Image</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Payment proof"
                className="h-44 max-w-md rounded-md border object-contain"
              />
            </div>
          )}
        </div>
      </FormCard>
    </form>
  );
}
