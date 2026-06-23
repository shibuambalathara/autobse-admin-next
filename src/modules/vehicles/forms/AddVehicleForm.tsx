"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { Button, FormCard, Input } from "@/components/ui";
import { FormField, FormGrid } from "@/components/forms";
import { CREATE_VEHICLE_MUTATION } from "@/graphql/documents/vehicles";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { ADD_VEHICLE_FIELDS } from "@/modules/vehicles/constants";
import { addVehicleValidation } from "@/modules/vehicles/forms/validation";
import { stripEmptyVehicleFields } from "@/modules/vehicles/utils/vehicle-payload";

interface AddVehicleFormValues {
  registrationNumber: string;
  loanAgreementNo: string;
  make?: string;
  model?: string;
  varient?: string;
  startPrice?: string;
  inspectionLink?: string;
  image?: string;
  repoDt?: string;
  reservePrice?: string;
  kmReading?: string;
  ownership?: string;
  YOM?: string;
  rcStatus?: string;
  quoteIncreament?: string;
}

interface AddVehicleFormProps {
  eventId: string;
}

export function AddVehicleForm({ eventId }: AddVehicleFormProps) {
  const router = useRouter();
  const [createVehicle, { loading }] = useMutation(CREATE_VEHICLE_MUTATION);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddVehicleFormValues>();

  const onSubmit = async (formData: AddVehicleFormValues) => {
    const payload: Record<string, string | number | undefined> = {
      registrationNumber: formData.registrationNumber,
      loanAgreementNo: formData.loanAgreementNo,
      make: formData.make,
      model: formData.model,
      varient: formData.varient,
      inspectionLink: formData.inspectionLink,
      image: formData.image,
      repoDt: formData.repoDt,
      rcStatus: formData.rcStatus,
    };

    if (formData.startPrice) payload.startPrice = Number(formData.startPrice);
    if (formData.reservePrice) payload.reservePrice = Number(formData.reservePrice);
    if (formData.kmReading) payload.kmReading = Number(formData.kmReading);
    if (formData.ownership) payload.ownership = Number(formData.ownership);
    if (formData.YOM) payload.YOM = Number(formData.YOM);
    if (formData.quoteIncreament) payload.quoteIncreament = Number(formData.quoteIncreament);

    try {
      await createVehicle({
        variables: {
          eventId,
          createVehicleInput: stripEmptyVehicleFields(payload),
        },
      });
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: `${formData.registrationNumber} added successfully!`,
        timer: 2500,
        showConfirmButton: false,
      });
      router.push(ROUTES.events);
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormCard
        title="Vehicle Details"
        description="Add a new vehicle to this event."
        footer={
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Submit"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.eventVehicles(eventId))}
            >
              Cancel
            </Button>
          </div>
        }
      >
        <FormGrid columns={3}>
          {ADD_VEHICLE_FIELDS.map((field) => (
            <FormField
              key={field.name}
              label={field.label}
              htmlFor={field.name}
              required={"required" in field && field.required}
              error={
                (errors as Record<string, { message?: string } | undefined>)[
                  field.name
                ]?.message
              }
            >
              <Input
                id={field.name}
                type={field.type}
                {...register(
                  field.name as keyof AddVehicleFormValues,
                  "required" in field && field.required
                    ? addVehicleValidation[
                        field.name as keyof typeof addVehicleValidation
                      ]
                    : undefined
                )}
              />
            </FormField>
          ))}
        </FormGrid>
      </FormCard>
    </form>
  );
}
