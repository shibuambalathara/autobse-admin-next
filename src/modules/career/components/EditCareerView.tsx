"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { APP_ROLES, isRole } from "@/auth/roles";
import { AccessDenied } from "@/auth/access-denied";
import { useAccess } from "@/auth/use-access";
import { Button, FormCard, PageContainer } from "@/components/ui";
import { LoadingState } from "@/components/feedback";
import {
  SINGLE_CAREER_QUERY,
  UPDATE_CAREER_MUTATION,
} from "@/graphql/documents/careers";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import {
  CareerFormFields,
  type CareerFormValues,
} from "@/modules/career/components/CareerFormFields";
import {
  toDatetimeLocalValue,
  toIsoDeadline,
} from "@/modules/career/constants";
import { useAuthenticatedAdminQuery } from "@/modules/career/hooks/useAuthenticatedAdminQuery";
import type { SingleCareerResult } from "@/modules/career/types";

interface EditCareerViewProps {
  careerId: string;
}

export function EditCareerView({ careerId }: EditCareerViewProps) {
  const router = useRouter();
  const { role } = useAccess();
  const isAdmin = isRole(role, APP_ROLES.ADMIN);
  const { canFetch } = useAuthenticatedAdminQuery();
  const [applicationDeadline, setApplicationDeadline] = useState("");

  const { data, loading, error } = useQuery<SingleCareerResult>(
    SINGLE_CAREER_QUERY,
    {
      variables: { where: { id: careerId } },
      skip: !canFetch || !careerId,
      fetchPolicy: "network-only",
    }
  );

  const [updateCareer, { loading: saving }] = useMutation(UPDATE_CAREER_MUTATION);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CareerFormValues>();

  useEffect(() => {
    if (!data?.career) return;
    const career = data.career;
    reset({
      title: career.title ?? "",
      location: career.location ?? "",
      yearOfExperience: career.yearOfExperience ?? "",
      category: career.category ?? undefined,
      urgency: career.urgency ?? undefined,
      type: career.type ?? undefined,
      package: career.package ?? "",
      description: career.description ?? "",
      requirement: career.requirement ?? "",
      responsibilities: career.responsibilities ?? "",
    });
    setApplicationDeadline(toDatetimeLocalValue(career.applicationDeadline));
  }, [data?.career, reset]);

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
      const result = await updateCareer({
        variables: {
          where: { id: careerId },
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

      if (!result.data?.updateCareer?.id) {
        throw new Error("Career update failed.");
      }

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Career updated successfully.",
        timer: 2500,
        showConfirmButton: false,
      });
      router.push(ROUTES.career);
    } catch (submitError: unknown) {
      const { message } = extractGraphqlError(submitError);
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    }
  };

  if (!isAdmin) {
    return (
      <AccessDenied
        title="Career access restricted"
        description="Only administrators can edit careers."
      />
    );
  }

  if (!canFetch || loading) {
    return (
      <PageContainer title="Edit Career" description="Update job opening details.">
        <LoadingState label="Loading career…" />
      </PageContainer>
    );
  }

  if (error || !data?.career) {
    return (
      <PageContainer title="Edit Career" description="Update job opening details.">
        <p className="text-sm text-red-600">
          {extractGraphqlError(error).message || "Career not found."}
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Career" description="Update job opening details.">
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
                <Button type="submit" isLoading={saving}>
                  Save Changes
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
