"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import { Button, FormCard, PageContainer } from "@/components/ui";
import { CREATE_CAREER_MUTATION } from "@/graphql/documents/careers";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import {
  CareerFormFields,
  type CareerFormValues,
} from "@/modules/career/components/CareerFormFields";
import { toIsoDeadline } from "@/modules/career/constants";

export function AddCareerView() {
  const router = useRouter();
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [createCareer, { loading }] = useMutation(CREATE_CAREER_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CareerFormValues>();

  const onSubmit = async (formData: CareerFormValues) => {
    if (!applicationDeadline) {
      await Swal.fire({
        icon: "error",
        title: "Missing deadline",
        text: "Application deadline is required.",
      });
      return;
    }

    try {
      const result = await createCareer({
        variables: {
          data: {
            title: formData.title.trim(),
            category: formData.category,
            urgency: formData.urgency,
            type: formData.type,
            location: formData.location.trim().toLowerCase(),
            yearOfExperience: formData.yearOfExperience.trim(),
            package: formData.package.trim(),
            description: formData.description.trim(),
            responsibilities: formData.responsibilities.trim(),
            requirement: formData.requirement.trim(),
            applicationDeadline: toIsoDeadline(applicationDeadline),
          },
        },
      });

      if (!result.data?.createCareer?.id) {
        throw new Error("Career creation failed.");
      }

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Career created successfully.",
        timer: 2500,
        showConfirmButton: false,
      });
      router.push(ROUTES.career);
    } catch (error: unknown) {
      const { message } = extractGraphqlError(error);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Career access restricted"
        description="Only administrators can create careers."
      />
    );
  }

  return (
    <PageContainer title="Add Career" description="Create a new job opening.">
      <div className="mx-auto w-full max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormCard
            title="Career Details"
            footer={
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(ROUTES.career)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={loading}>
                  Submit
                </Button>
              </>
            }
          >
            <CareerFormFields
              register={register}
              errors={errors}
              applicationDeadline={applicationDeadline}
              onApplicationDeadlineChange={setApplicationDeadline}
            />
          </FormCard>
        </form>
      </div>
    </PageContainer>
  );
}
