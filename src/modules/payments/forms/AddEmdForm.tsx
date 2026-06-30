"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { ArrowLeft, Download } from "lucide-react";
import Swal from "sweetalert2";
import {
  Button,
  FormCard,
  Input,
  PageContainer,
  Select,
  buttonVariants,
} from "@/components/ui";
import { FormField, FormGrid, FormSection } from "@/components/forms";
import { EmptyState, LoadingState } from "@/components/feedback";
import { useAuthenticatedQuery } from "@/auth/use-authenticated-query";
import {
  CREATE_EMD_UPDATE_MUTATION,
  PAYMENT_QUERY,
} from "@/graphql/documents/payments";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { PAYMENTS_FOR_OPTIONS } from "@/modules/users/constants";
import {
  downloadPaymentProofImage,
  resolvePaymentImageUrl,
} from "@/modules/payments/utils/payment-api";

interface AddEmdFormProps {
  paymentId: string;
}

interface AddEmdFormValues {
  buyingLimit: number;
}

function formatPaymentFor(value?: string | null): string {
  if (!value) return "—";
  const match = PAYMENTS_FOR_OPTIONS.find((option) => option.value === value);
  return match?.label ?? value;
}

export function AddEmdForm({ paymentId }: AddEmdFormProps) {
  const router = useRouter();
  const { canFetch } = useAuthenticatedQuery();
  const [adjustmentType, setAdjustmentType] = useState("Increment");
  const [currentLimit, setCurrentLimit] = useState(0);

  const { data, loading, error } = useQuery(PAYMENT_QUERY, {
    variables: { where: { id: paymentId } },
    fetchPolicy: "network-only",
    skip: !canFetch,
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

  const backHref = useMemo(
    () =>
      payment?.userId
        ? ROUTES.paymentUser(payment.userId)
        : ROUTES.payments,
    [payment?.userId]
  );

  const userName = payment?.user
    ? `${payment.user.firstName ?? ""} ${payment.user.lastName ?? ""}`.trim()
    : "";

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
      router.push(backHref);
    } catch (submitError: unknown) {
      const { message } = extractGraphqlError(submitError);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (!canFetch || (loading && !payment)) {
    return <LoadingState label="Loading payment…" />;
  }

  if (error || !payment) {
    return (
      <PageContainer title="Update Buying Limit">
        <EmptyState
          title="Payment not found"
          description={
            error
              ? extractGraphqlError(error).message
              : "The requested payment could not be loaded."
          }
          action={
            <Link href={ROUTES.payments} className={buttonVariants({ variant: "outline" })}>
              Back to Payments
            </Link>
          }
        />
      </PageContainer>
    );
  }

  const imageUrl = resolvePaymentImageUrl(payment.image);
  const isApprovedEmd =
    payment.paymentFor === "emd" && payment.status === "approved";

  return (
    <PageContainer
      title="Update Buying Limit"
      description={
        userName
          ? `Adjust vehicle buying limit for ${userName} based on this EMD payment.`
          : "Adjust the dealer vehicle buying limit for this EMD payment."
      }
      actions={
        <Link
          href={backHref}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          {payment.userId ? "Back to User Payments" : "Back to Payments"}
        </Link>
      }
    >
      <div className="mx-auto w-full max-w-3xl">
        {!isApprovedEmd && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Buying limit can only be updated for approved EMD payments.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormCard
            title="Buying Limit Adjustment"
            description="Increment or decrement the dealer's vehicle buying limit using the approved EMD amount."
            footer={
              <div className="flex flex-wrap gap-2">
                <Link href={backHref} className={buttonVariants({ variant: "outline" })}>
                  Cancel
                </Link>
                <Button type="submit" isLoading={saving} disabled={!isApprovedEmd}>
                  Save Changes
                </Button>
              </div>
            }
          >
            {payment.user && (
              <FormSection
                title="User"
                description="Buying limit will be updated for this dealer."
                className="mb-6"
              >
                <FormGrid columns={2}>
                  <FormField label="First Name" htmlFor="emd-first-name">
                    <Input
                      id="emd-first-name"
                      value={payment.user.firstName ?? ""}
                      disabled
                      readOnly
                    />
                  </FormField>
                  <FormField label="Last Name" htmlFor="emd-last-name">
                    <Input
                      id="emd-last-name"
                      value={payment.user.lastName ?? ""}
                      disabled
                      readOnly
                    />
                  </FormField>
                  <FormField label="Username" htmlFor="emd-username">
                    <Input
                      id="emd-username"
                      value={payment.user.username ?? ""}
                      disabled
                      readOnly
                    />
                  </FormField>
                  <FormField label="Mobile" htmlFor="emd-mobile">
                    <Input
                      id="emd-mobile"
                      value={payment.user.mobile ?? ""}
                      disabled
                      readOnly
                    />
                  </FormField>
                </FormGrid>
              </FormSection>
            )}

            <FormSection title="Payment" className="mb-6">
              <FormGrid columns={2}>
                <FormField label="Current Buying Limit" htmlFor="emd-current-limit">
                  <Input
                    id="emd-current-limit"
                    value={String(currentLimit)}
                    disabled
                    readOnly
                  />
                </FormField>
                <FormField label="Payment Amount" htmlFor="emd-amount">
                  <Input
                    id="emd-amount"
                    value={String(payment.amount ?? "")}
                    disabled
                    readOnly
                  />
                </FormField>
                <FormField label="Payment For" htmlFor="emd-payment-for">
                  <Input
                    id="emd-payment-for"
                    value={formatPaymentFor(payment.paymentFor)}
                    disabled
                    readOnly
                  />
                </FormField>
                <FormField label="Reference No." htmlFor="emd-ref-no">
                  <Input
                    id="emd-ref-no"
                    value={payment.refNo != null ? String(payment.refNo) : "—"}
                    disabled
                    readOnly
                  />
                </FormField>
              </FormGrid>
            </FormSection>

            <FormSection
              title="Adjustment"
              description="Choose whether to increase or decrease the buying limit and enter the amount."
            >
              <FormGrid columns={2}>
                <FormField label="Increment / Decrement" htmlFor="emd-adjustment">
                  <Select
                    id="emd-adjustment"
                    options={[
                      { label: "Increment", value: "Increment" },
                      ...(currentLimit > 0
                        ? [{ label: "Decrement", value: "Decrement" }]
                        : []),
                    ]}
                    value={adjustmentType}
                    disabled={!isApprovedEmd}
                    onChange={(e) => setAdjustmentType(e.target.value)}
                  />
                </FormField>

                <FormField
                  label={`${adjustmentType} Amount`}
                  htmlFor="emd-buying-limit"
                  required
                  error={errors.buyingLimit?.message}
                >
                  <Input
                    id="emd-buying-limit"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    placeholder="Enter amount"
                    disabled={!isApprovedEmd}
                    error={Boolean(errors.buyingLimit)}
                    {...register("buyingLimit", {
                      required: "Buying limit amount is required",
                      valueAsNumber: true,
                      validate: (value) =>
                        value > 0 || "Only positive integers are allowed",
                    })}
                  />
                </FormField>
              </FormGrid>
            </FormSection>

            {imageUrl && (
              <FormSection
                title="Payment Proof"
                description="Proof image linked to this EMD payment."
                className="mt-6"
              >
                <div className="relative max-w-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Payment proof"
                    className="h-44 w-full rounded-md border border-surface-border bg-surface-muted object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => void downloadPaymentProofImage(paymentId)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
                    title="Download image"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </FormSection>
            )}
          </FormCard>
        </form>
      </div>
    </PageContainer>
  );
}
