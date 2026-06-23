"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, FormCard, Input } from "@/components/ui";
import { FormField, FormGrid } from "@/components/forms";
import { LoadingState } from "@/components/feedback";
import {
  SELLER_DETAIL_QUERY,
  UPDATE_SELLER_MUTATION,
} from "@/graphql/documents/sellers";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { buildUpdateSellerInput } from "@/modules/sellers/forms/validation";
import type { EditSellerFormValues, SellerDetailResult } from "@/modules/sellers/types";

interface EditSellerFormProps {
  sellerId: string;
}

export function EditSellerForm({ sellerId }: EditSellerFormProps) {
  const router = useRouter();

  const { data, loading, error } = useQuery<SellerDetailResult>(
    SELLER_DETAIL_QUERY,
    {
      variables: { where: { id: sellerId } },
      skip: !sellerId,
      fetchPolicy: "network-only",
    }
  );

  const [updateSeller, { loading: updating }] = useMutation(UPDATE_SELLER_MUTATION);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditSellerFormValues>();

  const seller = data?.seller;

  useEffect(() => {
    if (!seller) return;
    reset({
      sellerCompanyName: seller.name ?? "",
      contactPerson: seller.contactPerson ?? "",
      GSTNumber: seller.GSTNumber ?? "",
      mobile: seller.mobile ?? "",
      nationalHead: seller.nationalHead ?? "",
      billingContactPerson: seller.billingContactPerson ?? "",
      logo: seller.logo ?? "",
    });
  }, [seller, reset]);

  const onSubmit = async (formData: EditSellerFormValues) => {
    try {
      await updateSeller({
        variables: {
          where: { id: sellerId },
          updateSellerInput: buildUpdateSellerInput(formData),
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: `${formData.sellerCompanyName.trim()} updated successfully.`,
        timer: 2500,
        showConfirmButton: false,
      });
      router.push(ROUTES.sellers);
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (loading) {
    return <LoadingState label="Loading seller…" />;
  }

  if (error || !seller) {
    return (
      <p className="text-sm text-red-600">
        {error ? extractGraphqlError(error).message : "Seller not found."}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title={`Seller: ${seller.name}`}
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.sellers)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={updating}>
              Save Changes
            </Button>
          </>
        }
      >
        <FormGrid>
          <FormField
            label="Seller Name"
            htmlFor="edit-seller-name"
            required
            error={errors.sellerCompanyName?.message}
          >
            <Input
              id="edit-seller-name"
              {...register("sellerCompanyName", {
                required: "Seller name is required",
              })}
            />
          </FormField>

          <FormField label="Contact Person" htmlFor="edit-contact-person">
            <Input id="edit-contact-person" {...register("contactPerson")} />
          </FormField>

          <FormField label="GST Number" htmlFor="edit-gst-number">
            <Input id="edit-gst-number" {...register("GSTNumber")} />
          </FormField>

          <FormField label="Mobile" htmlFor="edit-mobile">
            <Input id="edit-mobile" type="tel" {...register("mobile")} />
          </FormField>

          <FormField label="National Head" htmlFor="edit-national-head">
            <Input id="edit-national-head" {...register("nationalHead")} />
          </FormField>

          <FormField label="Billing Contact Person" htmlFor="edit-billing-contact">
            <Input id="edit-billing-contact" {...register("billingContactPerson")} />
          </FormField>

          <FormField label="Logo URL" htmlFor="edit-logo">
            <Input id="edit-logo" type="url" {...register("logo")} />
          </FormField>
        </FormGrid>
      </FormCard>
    </form>
  );
}
