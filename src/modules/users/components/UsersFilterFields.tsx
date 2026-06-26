"use client";

import { FormField } from "@/components/forms";
import { Select } from "@/components/ui";
import {
  INDIAN_STATES,
  USER_ROLE_FILTER_OPTIONS,
  USER_STATUS_OPTIONS,
} from "@/modules/users/constants";
import type { UserRoleType, UserStatusType } from "@/modules/users/types";
import { cn } from "@/lib/utils";

export interface UsersFilterFieldsProps {
  registrationExpiryDate: string;
  setRegistrationExpiryDate: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  role: UserRoleType | "";
  setRole: (value: UserRoleType | "") => void;
  status: UserStatusType | "";
  setStatus: (value: UserStatusType | "") => void;
  layout?: "grid" | "stack";
}

export function UsersFilterFields({
  registrationExpiryDate,
  setRegistrationExpiryDate,
  state,
  setState,
  role,
  setRole,
  status,
  setStatus,
  layout = "grid",
}: UsersFilterFieldsProps) {
  const isStacked = layout === "stack";

  return (
    <div
      className={cn(
        isStacked
          ? "flex flex-col gap-4"
          : "contents"
      )}
    >
      <FormField label="Registration Expiry" htmlFor="users-expiry">
        <input
          id="users-expiry"
          type="month"
          className="h-10 w-full rounded-md border border-surface-border px-3 text-sm"
          value={registrationExpiryDate}
          onChange={(e) => setRegistrationExpiryDate(e.target.value)}
        />
      </FormField>

      <FormField label="State" htmlFor="users-state">
        <Select
          id="users-state"
          placeholder="All states"
          options={INDIAN_STATES}
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
      </FormField>

      <FormField label="Role" htmlFor="users-role">
        <Select
          id="users-role"
          placeholder="All roles"
          options={USER_ROLE_FILTER_OPTIONS}
          value={role}
          onChange={(e) => setRole(e.target.value as UserRoleType | "")}
        />
      </FormField>

      <FormField label="Status" htmlFor="users-status">
        <Select
          id="users-status"
          placeholder="All statuses"
          options={[...USER_STATUS_OPTIONS]}
          value={status}
          onChange={(e) => setStatus(e.target.value as UserStatusType | "")}
        />
      </FormField>
    </div>
  );
}
