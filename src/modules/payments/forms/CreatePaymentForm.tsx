"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, FormCard, Input, PageContainer, Select, buttonVariants } from "@/components/ui";
import { FormField, FormGrid, FormSection, Textarea } from "@/components/forms";
import { LoadingState } from "@/components/feedback";
import { CREATE_PAYMENT_MUTATION } from "@/graphql/documents/payments";
import { VIEW_USER_QUERY } from "@/graphql/documents/users";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { PAYMENTS_FOR_OPTIONS } from "@/modules/users/constants";
import { MAX_PAYMENT_IMAGE_BYTES } from "@/modules/payments/constants";
import {
  sanitizePaymentAmountInput,
  uploadPaymentImage,
} from "@/modules/payments/utils/payment-api";

interface CreatePaymentFormProps {
  userId: string;
}

interface CreatePaymentFormValues {
  amount: string;
  description?: string;
  paymentFor: string;
  imgForPaymentProof?: FileList;
}

const fileInputClassName =
  "block w-full text-sm text-brand-700 file:mr-4 file:rounded-md file:border-0 file:bg-brand-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-900";

export function CreatePaymentForm({ userId }: CreatePaymentFormProps) {
  const router = useRouter();
  const [createPayment, { loading }] = useMutation(CREATE_PAYMENT_MUTATION);

  const { data: userData, loading: userLoading } = useQuery(VIEW_USER_QUERY, {
    variables: { where: { id: userId } },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePaymentFormValues>();

  const onSubmit = async (formData: CreatePaymentFormValues) => {
    const file = formData.imgForPaymentProof?.[0];
    if (file && file.size > MAX_PAYMENT_IMAGE_BYTES) {
      await Swal.fire({
        icon: "error",
        title: "File too large",
        text: "File size must be less than 1MB.",
      });
      return;
    }

    try {
      const result = await createPayment({
        variables: {
          userId,
          createPaymentInput: {
            amount: Number(formData.amount),
            description: formData.description?.trim() || "",
            paymentFor: formData.paymentFor,
          },
        },
      });

      const paymentId = result.data?.createPayment?.id;
      if (!paymentId) {
        throw new Error("Payment creation failed. No ID returned.");
      }

      if (file) {
        await uploadPaymentImage(paymentId, file);
      }

      await Swal.fire({
        icon: "success",
        title: "Payment created",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push(ROUTES.paymentUser(userId));
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  const user = userData?.user;
  const userName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "";

  if (userLoading) {
    return <LoadingState label="Loading user details…" />;
  }

  return (
    <PageContainer
      title="Create Payment"
      description={
        userName
          ? `Record a new payment for ${userName}.`
          : "Record a new payment for this user."
      }
      actions={
        <Link
          href={ROUTES.paymentUser(userId)}
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          Back to Payments
        </Link>
      }
    >
      <div className="mx-auto w-full max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormCard
            title="Payment Details"
            description="Enter the payment amount, type, and optional proof image."
            footer={
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(ROUTES.paymentUser(userId))}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={loading}>
                  Save Payment
                </Button>
              </>
            }
          >
            {user && (
              <FormSection
                title="User"
                description="Payment will be linked to this account."
                className="mb-6"
              >
                <FormGrid columns={2}>
                  <FormField label="First Name" htmlFor="user-first-name">
                    <Input
                      id="user-first-name"
                      value={user.firstName ?? ""}
                      disabled
                      readOnly
                    />
                  </FormField>
                  <FormField label="Last Name" htmlFor="user-last-name">
                    <Input
                      id="user-last-name"
                      value={user.lastName ?? ""}
                      disabled
                      readOnly
                    />
                  </FormField>
                  <FormField label="Mobile" htmlFor="user-mobile">
                    <Input
                      id="user-mobile"
                      value={user.mobile ?? ""}
                      disabled
                      readOnly
                    />
                  </FormField>
                  <FormField label="Username" htmlFor="user-username">
                    <Input
                      id="user-username"
                      value={user.username ?? ""}
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
                  htmlFor="payment-amount"
                  required
                  error={errors.amount?.message}
                >
                  <Input
                    id="payment-amount"
                    type="number"
                    inputMode="numeric"
                    placeholder="Enter amount"
                    error={Boolean(errors.amount)}
                    {...register("amount", {
                      required: "Amount is required",
                      onChange: (e) => {
                        e.target.value = sanitizePaymentAmountInput(e.target.value);
                      },
                    })}
                  />
                </FormField>

                <FormField
                  label="Payment For"
                  htmlFor="payment-for"
                  required
                  error={errors.paymentFor?.message}
                >
                  <Select
                    id="payment-for"
                    placeholder="Select payment type"
                    options={PAYMENTS_FOR_OPTIONS}
                    error={Boolean(errors.paymentFor)}
                    {...register("paymentFor", {
                      required: "Payment type is required",
                    })}
                  />
                </FormField>

                <FormField
                  label="Description"
                  htmlFor="payment-description"
                  className="md:col-span-2"
                  hint="Optional notes about this payment."
                >
                  <Textarea
                    id="payment-description"
                    rows={3}
                    placeholder="Add a short description (optional)"
                    {...register("description")}
                  />
                </FormField>

                <FormField
                  label="Payment Proof Image"
                  htmlFor="payment-proof"
                  className="md:col-span-2"
                  hint="Optional. Maximum file size is 1MB."
                  error={errors.imgForPaymentProof?.message as string | undefined}
                >
                  <Input
                    id="payment-proof"
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
              </FormGrid>
            </FormSection>
          </FormCard>
        </form>
      </div>
    </PageContainer>
  );
}
