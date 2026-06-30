"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { ArrowLeft, Download } from "lucide-react";
import Swal from "sweetalert2";
import { Can } from "@/auth/can";
import { PERMISSIONS } from "@/auth/permissions";
import { useAuthenticatedQuery } from "@/auth/use-authenticated-query";
import {
  Button,
  FormCard,
  Input,
  PageContainer,
  Select,
  buttonVariants,
} from "@/components/ui";
import { FormField, FormGrid, FormSection } from "@/components/forms";
import {
  PAYMENT_QUERY,
  UPDATE_PAYMENT_MUTATION,
} from "@/graphql/documents/payments";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { convertUtcToDateTimeLocal } from "@/lib/date-format";
import { PAYMENTS_FOR_OPTIONS } from "@/modules/users/constants";
import { ChangePaymentStatusModal } from "@/modules/payments/components/ChangePaymentStatusModal";
import { MAX_PAYMENT_IMAGE_BYTES } from "@/modules/payments/constants";
import {
  downloadPaymentProofImage,
  resolvePaymentImageUrl,
  sanitizePaymentAmountInput,
  uploadPaymentImage,
} from "@/modules/payments/utils/payment-api";
import { EmptyState, LoadingState } from "@/components/feedback";

interface EditPaymentFormProps {
  paymentId: string;
}

interface EditPaymentFormValues {
  amount: string;
  paymentFor: string;
  description?: string;
  registrationExpire?: string;
  imgForPaymentProof?: FileList;
}

const fileInputClassName =
  "block w-full text-sm text-brand-700 file:mr-4 file:rounded-md file:border-0 file:bg-brand-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-900";

function formatPaymentStatus(status?: string | null): string {
  if (!status) return "—";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function EditPaymentForm({ paymentId }: EditPaymentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUserId = searchParams.get("userId");
  const { canFetch } = useAuthenticatedQuery();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(PAYMENT_QUERY, {
    variables: { where: { id: paymentId } },
    fetchPolicy: "network-only",
    skip: !canFetch,
  });

  const [updatePayment, { loading: saving }] = useMutation(UPDATE_PAYMENT_MUTATION);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditPaymentFormValues>();

  const payment = data?.payment;
  const paymentFor = watch("paymentFor");
  const isPending = payment?.status === "pending";

  useEffect(() => {
    if (!payment) return;
    setValue("amount", String(payment.amount ?? ""));
    setValue("paymentFor", payment.paymentFor ?? "");
    setValue("description", payment.description ?? "");
    setValue(
      "registrationExpire",
      convertUtcToDateTimeLocal(payment.registrationExpire)
    );
    setImageUrl(resolvePaymentImageUrl(payment.image));
  }, [payment, setValue]);

  const onSubmit = async (formData: EditPaymentFormValues) => {
    const updateInput: Record<string, unknown> = {
      amount: Number(formData.amount),
      paymentFor: formData.paymentFor,
      description: formData.description?.trim() || "",
    };

    if (formData.paymentFor === "registrations" && formData.registrationExpire) {
      updateInput.registrationExpire = new Date(
        formData.registrationExpire
      ).toISOString();
    }

    try {
      await updatePayment({
        variables: {
          where: { id: paymentId },
          updatePaymentInput: updateInput,
        },
      });

      const file = formData.imgForPaymentProof?.[0];
      if (file) {
        await uploadPaymentImage(paymentId, file);
      }

      await Swal.fire({
        icon: "success",
        title: "Payment updated",
        timer: 2000,
        showConfirmButton: false,
      });

      if (returnUserId) {
        router.push(ROUTES.paymentUser(returnUserId));
      } else {
        router.push(ROUTES.payments);
      }
    } catch (submitError: unknown) {
      const { message } = extractGraphqlError(submitError);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  const handleUploadOnly = async () => {
    const file = watch("imgForPaymentProof")?.[0];
    if (!file) {
      await Swal.fire({
        icon: "warning",
        title: "No file selected",
        text: "Please select an image to upload.",
      });
      return;
    }
    if (file.size > MAX_PAYMENT_IMAGE_BYTES) {
      await Swal.fire({
        icon: "error",
        title: "File too large",
        text: "File size must be less than 1MB.",
      });
      return;
    }

    try {
      setUploading(true);
      await uploadPaymentImage(paymentId, file);
      await refetch();
      await Swal.fire({
        icon: "success",
        title: "Image uploaded",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (uploadError: unknown) {
      const { message } = extractGraphqlError(uploadError);
      await Swal.fire({ icon: "error", title: "Upload failed", text: message });
    } finally {
      setUploading(false);
    }
  };

  const backHref = returnUserId
    ? ROUTES.paymentUser(returnUserId)
    : ROUTES.payments;

  const backLabel = returnUserId ? "Back to User Payments" : "Back to Payments";

  if (!canFetch || (loading && !payment)) {
    return <LoadingState label="Loading payment…" />;
  }

  if (error || !payment) {
    return (
      <PageContainer title="Update Payment">
        <EmptyState
          title="Payment not found"
          description={
            error
              ? extractGraphqlError(error).message
              : "The requested payment could not be loaded."
          }
          action={
            <Link href={backHref} className={buttonVariants({ variant: "outline" })}>
              {backLabel}
            </Link>
          }
        />
      </PageContainer>
    );
  }

  const userName = payment.user
    ? `${payment.user.firstName ?? ""} ${payment.user.lastName ?? ""}`.trim()
    : "";

  return (
    <PageContainer
      title="Update Payment"
      description={
        userName
          ? `Edit payment details for ${userName}.`
          : "Edit payment amount, description, and proof image."
      }
      actions={
        <Link
          href={backHref}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      }
    >
      <div className="mx-auto w-full max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormCard
            title="Payment Details"
            description={
              isPending
                ? "Pending payments can be edited, approved, or rejected."
                : "This payment has been processed. Only some fields may be editable."
            }
            footer={
              <div className="flex flex-wrap gap-2">
                <Link href={backHref} className={buttonVariants({ variant: "outline" })}>
                  Cancel
                </Link>
                <Can permission={PERMISSIONS.PAYMENTS_MANAGE}>
                  <Button type="submit" isLoading={saving}>
                    Save Changes
                  </Button>
                </Can>
              </div>
            }
          >
            {payment.user && (
              <FormSection
                title="User"
                description="Payment is linked to this account."
                className="mb-6"
              >
                <FormGrid columns={2}>
                  <FormField label="First Name" htmlFor="edit-first-name">
                    <Input
                      id="edit-first-name"
                      value={payment.user.firstName ?? ""}
                      disabled
                      readOnly
                    />
                  </FormField>
                  <FormField label="Last Name" htmlFor="edit-last-name">
                    <Input
                      id="edit-last-name"
                      value={payment.user.lastName ?? ""}
                      disabled
                      readOnly
                    />
                  </FormField>
                  <FormField label="Username" htmlFor="edit-username">
                    <Input
                      id="edit-username"
                      value={payment.user.username ?? ""}
                      disabled
                      readOnly
                    />
                  </FormField>
                  <FormField label="Mobile" htmlFor="edit-mobile">
                    <Input
                      id="edit-mobile"
                      value={payment.user.mobile ?? ""}
                      disabled
                      readOnly
                    />
                  </FormField>
                </FormGrid>
              </FormSection>
            )}

            <FormSection title="Payment">
              <FormGrid columns={2}>
                <FormField
                  label="Amount"
                  htmlFor="edit-amount"
                  required
                  error={errors.amount?.message}
                >
                  <Input
                    id="edit-amount"
                    type="number"
                    inputMode="numeric"
                    error={Boolean(errors.amount)}
                    {...register("amount", {
                      required: "Amount is required",
                      onChange: (e) => {
                        e.target.value = sanitizePaymentAmountInput(e.target.value);
                      },
                    })}
                  />
                </FormField>

                <FormField label="Payment For" htmlFor="edit-payment-for">
                  <Select
                    id="edit-payment-for"
                    options={PAYMENTS_FOR_OPTIONS}
                    disabled
                    {...register("paymentFor")}
                  />
                </FormField>

                <FormField
                  label="Description"
                  htmlFor="edit-description"
                  className="md:col-span-2"
                  hint={!isPending ? "Description can only be edited while payment is pending." : undefined}
                >
                  <Input
                    id="edit-description"
                    disabled={!isPending}
                    placeholder="Add a short description"
                    {...register("description")}
                  />
                </FormField>

                {paymentFor === "registrations" && (
                  <FormField
                    label="Registration Expire"
                    htmlFor="edit-registration-expire"
                    className="md:col-span-2"
                  >
                    <Input
                      id="edit-registration-expire"
                      type="datetime-local"
                      {...register("registrationExpire")}
                    />
                  </FormField>
                )}

                <div className="md:col-span-2 flex flex-wrap items-end gap-3">
                  <FormField
                    label="Payment Status"
                    htmlFor="edit-payment-status"
                    className="min-w-[200px] flex-1"
                  >
                    <Input
                      id="edit-payment-status"
                      value={formatPaymentStatus(payment.status)}
                      disabled
                      readOnly
                    />
                  </FormField>
                  {isPending && (
                    <Can permission={PERMISSIONS.PAYMENTS_MANAGE}>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setStatusModalOpen(true)}
                      >
                        Change Status
                      </Button>
                    </Can>
                  )}
                </div>
              </FormGrid>
            </FormSection>

            <FormSection
              title="Payment Proof"
              description="View or replace the uploaded proof image."
              className="mt-6"
            >
              {imageUrl && (
                <div className="mb-4 space-y-2">
                  <p className="text-sm font-medium text-brand-800">Current image</p>
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
                </div>
              )}

              <FormField
                label="Upload New Payment Proof"
                htmlFor="edit-payment-proof"
                hint="Optional. Maximum file size is 1MB."
                error={errors.imgForPaymentProof?.message as string | undefined}
              >
                <Input
                  id="edit-payment-proof"
                  type="file"
                  accept="image/*"
                  className={fileInputClassName}
                  error={Boolean(errors.imgForPaymentProof)}
                  {...register("imgForPaymentProof", {
                    validate: (files: FileList | undefined) => {
                      const selected = files?.[0];
                      if (!selected) return true;
                      return (
                        selected.size <= MAX_PAYMENT_IMAGE_BYTES ||
                        "File size must be less than 1MB"
                      );
                    },
                  })}
                />
              </FormField>

              {isPending && (
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    onClick={() => void handleUploadOnly()}
                  >
                    {uploading ? "Uploading…" : "Upload Image Only"}
                  </Button>
                </div>
              )}
            </FormSection>
          </FormCard>
        </form>
      </div>

      <ChangePaymentStatusModal
        open={statusModalOpen}
        paymentId={paymentId}
        paymentFor={payment?.paymentFor}
        currentStatus={payment?.status}
        onClose={() => setStatusModalOpen(false)}
        onSuccess={() => void refetch()}
      />
    </PageContainer>
  );
}
