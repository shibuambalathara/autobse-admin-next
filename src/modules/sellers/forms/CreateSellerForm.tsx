"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, FormCard, Input } from "@/components/ui";
import { FormField, FormGrid } from "@/components/forms";
import { CREATE_SELLER_MUTATION } from "@/graphql/documents/sellers";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { buildCreateSellerInput } from "@/modules/sellers/forms/validation";
import type { CreateSellerFormValues } from "@/modules/sellers/types";

export function CreateSellerForm() {
  const router = useRouter();
  const [createSeller, { loading }] = useMutation(CREATE_SELLER_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSellerFormValues>();

  const onSubmit = async (formData: CreateSellerFormValues) => {
    try {
      await createSeller({
        variables: {
          createSellerInput: buildCreateSellerInput(formData),
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: `${formData.sellerCompanyName.trim()} added successfully.`,
        timer: 2500,
        showConfirmButton: false,
      });
      router.push(ROUTES.sellers);
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title="Seller Details"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.sellers)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Save Seller
            </Button>
          </>
        }
      >
        <FormGrid>
          <FormField
            label="Seller Name"
            htmlFor="seller-company-name"
            required
            error={errors.sellerCompanyName?.message}
          >
            <Input
              id="seller-company-name"
              {...register("sellerCompanyName", {
                required: "Seller name is required",
              })}
            />
          </FormField>

          <FormField label="GST Number" htmlFor="seller-gst">
            <Input id="seller-gst" {...register("gst")} />
          </FormField>

          <FormField label="Billing Contact Person" htmlFor="seller-billing-contact">
            <Input id="seller-billing-contact" {...register("billingContactPerson")} />
          </FormField>

          <FormField label="Contact Person" htmlFor="seller-contact-person">
            <Input id="seller-contact-person" {...register("contactPerson")} />
          </FormField>

          <FormField label="Mobile" htmlFor="seller-mobile">
            <Input id="seller-mobile" type="tel" {...register("mobile")} />
          </FormField>

          <FormField label="National Head" htmlFor="seller-national-head">
            <Input id="seller-national-head" {...register("nationalHead")} />
          </FormField>
        </FormGrid>
      </FormCard>
    </form>
  );
}
