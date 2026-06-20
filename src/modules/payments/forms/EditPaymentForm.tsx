"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { Download } from "lucide-react";
import Swal from "sweetalert2";
import { Can } from "@/auth/can";
import { PERMISSIONS } from "@/auth/permissions";
import { Button, FormCard, Input, Select, buttonVariants } from "@/components/ui";
import { FormField } from "@/components/forms";
import {
  PAYMENT_QUERY,
  UPDATE_PAYMENT_MUTATION,
} from "@/graphql/documents/payments";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { convertUtcToDateTimeLocal } from "@/lib/date-format";
import { PAYMENTS_FOR_OPTIONS } from "@/modules/users/constants";
import { ChangePaymentStatusModal } from "@/modules/payments/components/ChangePaymentStatusModal";
import {
  MAX_PAYMENT_IMAGE_BYTES,
} from "@/modules/payments/constants";
import {
  downloadPaymentProofImage,
  resolvePaymentImageUrl,
  sanitizePaymentAmountInput,
  uploadPaymentImage,
} from "@/modules/payments/utils/payment-api";
import { LoadingState } from "@/components/feedback";

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

export function EditPaymentForm({ paymentId }: EditPaymentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUserId = searchParams.get("userId");

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { data, loading, refetch } = useQuery(PAYMENT_QUERY, {
    variables: { where: { id: paymentId } },
    fetchPolicy: "network-only",
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
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
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
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Upload failed", text: message });
    } finally {
      setUploading(false);
    }
  };

  if (loading && !payment) {
    return <LoadingState label="Loading payment…" />;
  }

  const userName = payment?.user
    ? `${payment.user.firstName ?? ""}`.trim()
    : "";

  const backHref = returnUserId
    ? ROUTES.paymentUser(returnUserId)
    : ROUTES.payments;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormCard
          title={`Update Payment${userName ? ` of ${userName}` : ""}`}
          footer={
            <div className="flex flex-wrap gap-2">
              <Link href={backHref} className={buttonVariants({ variant: "outline" })}>
                Cancel
              </Link>
              <Can permission={PERMISSIONS.PAYMENTS_MANAGE}>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </Can>
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="First Name" htmlFor="edit-first-name">
              <Input id="edit-first-name" value={payment?.user?.firstName ?? ""} disabled readOnly />
            </FormField>
            <FormField label="User Name" htmlFor="edit-username">
              <Input id="edit-username" value={payment?.user?.username ?? ""} disabled readOnly />
            </FormField>

            <FormField label="Amount" htmlFor="edit-amount" error={errors.amount?.message}>
              <Input
                id="edit-amount"
                type="number"
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

            <FormField label="Description" htmlFor="edit-description" className="md:col-span-2">
              <Input
                id="edit-description"
                disabled={payment?.status !== "pending"}
                {...register("description")}
              />
            </FormField>

            {paymentFor === "registrations" && (
              <FormField label="Registration Expire" htmlFor="edit-registration-expire">
                <Input
                  id="edit-registration-expire"
                  type="datetime-local"
                  {...register("registrationExpire")}
                />
              </FormField>
            )}

            <div className="md:col-span-2 flex flex-wrap items-end gap-3">
              <FormField label="Payment Status" htmlFor="edit-payment-status" className="flex-1 min-w-[200px]">
                <Input id="edit-payment-status" value={payment?.status ?? ""} disabled readOnly />
              </FormField>
              {payment?.status === "pending" && (
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

            {imageUrl && (
              <div className="md:col-span-2 space-y-2">
                <p className="text-sm font-medium">Payment Proof Image</p>
                <div className="relative max-w-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Payment proof"
                    className="h-40 w-full rounded-md border object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => void downloadPaymentProofImage(paymentId)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                    title="Download image"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <FormField
              label="Upload New Payment Proof Image (max 1MB)"
              htmlFor="edit-payment-proof"
              className="md:col-span-2"
              error={errors.imgForPaymentProof?.message as string | undefined}
            >
              <Input
                id="edit-payment-proof"
                type="file"
                accept="image/*"
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

            {payment?.status === "pending" && (
              <div className="md:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => void handleUploadOnly()}
                >
                  {uploading ? "Uploading…" : "Upload Image"}
                </Button>
              </div>
            )}
          </div>
        </FormCard>
      </form>

      <ChangePaymentStatusModal
        open={statusModalOpen}
        paymentId={paymentId}
        paymentFor={payment?.paymentFor}
        currentStatus={payment?.status}
        onClose={() => setStatusModalOpen(false)}
        onSuccess={() => void refetch()}
      />
    </>
  );
}
