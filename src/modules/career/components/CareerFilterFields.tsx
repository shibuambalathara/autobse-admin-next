"use client";

import { Button, Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import {
  CAREER_URGENCY_OPTIONS,
  JOB_DEPARTMENT_OPTIONS,
  JOB_TYPE_OPTIONS,
} from "@/modules/career/constants";
import type { CareerUrgency, JobDepartment, JobType } from "@/modules/career/types";

interface CareerFilterFieldsProps {
  category: JobDepartment | "";
  type: JobType | "";
  location: string;
  urgency: CareerUrgency | "";
  locationOptions: { label: string; value: string }[];
  onCategoryChange: (value: JobDepartment | "") => void;
  onTypeChange: (value: JobType | "") => void;
  onLocationChange: (value: string) => void;
  onUrgencyChange: (value: CareerUrgency | "") => void;
  onClear: () => void;
}

export function CareerFilterFields({
  category,
  type,
  location,
  urgency,
  locationOptions,
  onCategoryChange,
  onTypeChange,
  onLocationChange,
  onUrgencyChange,
  onClear,
}: CareerFilterFieldsProps) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
      <FormField label="Job Category" htmlFor="career-category-filter">
        <Select
          id="career-category-filter"
          value={category}
          onChange={(event) =>
            onCategoryChange(event.target.value as JobDepartment | "")
          }
          options={[
            { label: "All categories", value: "" },
            ...JOB_DEPARTMENT_OPTIONS,
          ]}
        />
      </FormField>

      <FormField label="Job Type" htmlFor="career-type-filter">
        <Select
          id="career-type-filter"
          value={type}
          onChange={(event) => onTypeChange(event.target.value as JobType | "")}
          options={[{ label: "All types", value: "" }, ...JOB_TYPE_OPTIONS]}
        />
      </FormField>

      <FormField label="Location" htmlFor="career-location-filter">
        <Select
          id="career-location-filter"
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
          options={[{ label: "All locations", value: "" }, ...locationOptions]}
        />
      </FormField>

      <FormField label="Urgency" htmlFor="career-urgency-filter">
        <Select
          id="career-urgency-filter"
          value={urgency}
          onChange={(event) =>
            onUrgencyChange(event.target.value as CareerUrgency | "")
          }
          options={[
            { label: "All urgency levels", value: "" },
            ...CAREER_URGENCY_OPTIONS,
          ]}
        />
      </FormField>

      <div className="flex items-end">
        <Button type="button" variant="outline" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
