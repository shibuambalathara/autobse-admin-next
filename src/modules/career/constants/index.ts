import type {
  CareerUrgency,
  JobDepartment,
  JobType,
} from "@/modules/career/types";

export const CAREERS_PAGE_SIZE = 10;

export const JOB_DEPARTMENT_OPTIONS: {
  label: string;
  value: JobDepartment;
}[] = [
  { label: "Software Engineering", value: "Software_Engineering" },
  { label: "Accounting and Finance", value: "Accounting_and_Finance" },
  { label: "Digital Marketing", value: "Digital_Marketing" },
  { label: "Human Resources", value: "Human_Resources" },
  { label: "Marketing and Sales", value: "Marketing_and_Sales" },
];

export const JOB_TYPE_OPTIONS: { label: string; value: JobType }[] = [
  { label: "Full Time", value: "Full_Time" },
  { label: "Part Time", value: "Part_Time" },
];

export const CAREER_URGENCY_OPTIONS: {
  label: string;
  value: CareerUrgency;
}[] = [
  { label: "Low", value: "LOW" },
  { label: "Normal", value: "NORMAL" },
  { label: "High", value: "HIGH" },
  { label: "Urgent", value: "URGENT" },
];

export function formatJobDepartment(value?: string | null): string {
  if (!value) return "—";
  const match = JOB_DEPARTMENT_OPTIONS.find((option) => option.value === value);
  return match?.label ?? value.replace(/_/g, " ");
}

export function formatJobType(value?: string | null): string {
  if (!value) return "—";
  const match = JOB_TYPE_OPTIONS.find((option) => option.value === value);
  return match?.label ?? value.replace(/_/g, " ");
}

export function formatCareerUrgency(value?: string | null): string {
  if (!value) return "—";
  const match = CAREER_URGENCY_OPTIONS.find((option) => option.value === value);
  return match?.label ?? value;
}

export function toDatetimeLocalValue(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export function toIsoDeadline(value: string): string {
  return new Date(value).toISOString();
}
