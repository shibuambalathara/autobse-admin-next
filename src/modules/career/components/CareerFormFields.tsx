"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input, Select } from "@/components/ui";
import { FormField, FormGrid, Textarea } from "@/components/forms";
import {
  CAREER_URGENCY_OPTIONS,
  JOB_DEPARTMENT_OPTIONS,
  JOB_TYPE_OPTIONS,
} from "@/modules/career/constants";
import type {
  CareerUrgency,
  JobDepartment,
  JobType,
} from "@/modules/career/types";

export interface CareerFormValues {
  title: string;
  location: string;
  yearOfExperience: string;
  category: JobDepartment;
  urgency: CareerUrgency;
  type: JobType;
  package: string;
  description: string;
  requirement: string;
  responsibilities: string;
}

interface CareerFormFieldsProps {
  register: UseFormRegister<CareerFormValues>;
  errors: FieldErrors<CareerFormValues>;
  applicationDeadline: string;
  onApplicationDeadlineChange: (value: string) => void;
}

export function CareerFormFields({
  register,
  errors,
  applicationDeadline,
  onApplicationDeadlineChange,
}: CareerFormFieldsProps) {
  return (
    <FormGrid>
      <FormField
        label="Designation"
        htmlFor="career-title"
        required
        error={errors.title?.message}
      >
        <Input
          id="career-title"
          {...register("title", { required: "Designation is required" })}
        />
      </FormField>

      <FormField
        label="Location"
        htmlFor="career-location"
        required
        error={errors.location?.message}
      >
        <Input
          id="career-location"
          {...register("location", { required: "Location is required" })}
        />
      </FormField>

      <FormField
        label="Experience (Years)"
        htmlFor="career-experience"
        required
        error={errors.yearOfExperience?.message}
      >
        <Input
          id="career-experience"
          {...register("yearOfExperience", {
            required: "Experience is required",
          })}
        />
      </FormField>

      <FormField
        label="Category"
        htmlFor="career-category"
        required
        error={errors.category?.message}
      >
        <Select
          id="career-category"
          options={[
            { label: "Select category", value: "" },
            ...JOB_DEPARTMENT_OPTIONS,
          ]}
          {...register("category", { required: "Category is required" })}
        />
      </FormField>

      <FormField
        label="Urgency"
        htmlFor="career-urgency"
        required
        error={errors.urgency?.message}
      >
        <Select
          id="career-urgency"
          options={[
            { label: "Select urgency", value: "" },
            ...CAREER_URGENCY_OPTIONS,
          ]}
          {...register("urgency", { required: "Urgency is required" })}
        />
      </FormField>

      <FormField
        label="Type"
        htmlFor="career-type"
        required
        error={errors.type?.message}
      >
        <Select
          id="career-type"
          options={[
            { label: "Select type", value: "" },
            ...JOB_TYPE_OPTIONS,
          ]}
          {...register("type", { required: "Type is required" })}
        />
      </FormField>

      <FormField
        label="Package"
        htmlFor="career-package"
        required
        error={errors.package?.message}
      >
        <Input
          id="career-package"
          {...register("package", { required: "Package is required" })}
        />
      </FormField>

      <FormField
        label="Application Deadline"
        htmlFor="career-deadline"
        required
      >
        <Input
          id="career-deadline"
          type="datetime-local"
          value={applicationDeadline}
          onChange={(event) => onApplicationDeadlineChange(event.target.value)}
          required
        />
      </FormField>

      <div className="col-span-full">
        <FormField
          label="Description"
          htmlFor="career-description"
          required
          error={errors.description?.message}
        >
          <Textarea
            id="career-description"
            rows={5}
            {...register("description", { required: "Description is required" })}
          />
        </FormField>
      </div>

      <div className="col-span-full">
        <FormField
          label="Requirement"
          htmlFor="career-requirement"
          required
          error={errors.requirement?.message}
        >
          <Textarea
            id="career-requirement"
            rows={5}
            {...register("requirement", { required: "Requirement is required" })}
          />
        </FormField>
      </div>

      <div className="col-span-full">
        <FormField
          label="Responsibilities"
          htmlFor="career-responsibilities"
          required
          error={errors.responsibilities?.message}
        >
          <Textarea
            id="career-responsibilities"
            rows={5}
            {...register("responsibilities", {
              required: "Responsibilities are required",
            })}
          />
        </FormField>
      </div>
    </FormGrid>
  );
}
