"use client";

import { Button, Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import {
  NOTIFICATION_READ_OPTIONS,
  NOTIFICATION_TYPE_OPTIONS,
} from "@/modules/notifications/constants";
import type { NotificationType } from "@/modules/notifications/types";

interface NotificationFilterFieldsProps {
  type: NotificationType | "";
  isRead: "" | "true" | "false";
  onTypeChange: (value: NotificationType | "") => void;
  onIsReadChange: (value: "" | "true" | "false") => void;
  onClear: () => void;
}

export function NotificationFilterFields({
  type,
  isRead,
  onTypeChange,
  onIsReadChange,
  onClear,
}: NotificationFilterFieldsProps) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
      <FormField label="Type" htmlFor="notification-type">
        <Select
          id="notification-type"
          placeholder="All types"
          options={NOTIFICATION_TYPE_OPTIONS}
          value={type}
          onChange={(e) =>
            onTypeChange(e.target.value as NotificationType | "")
          }
        />
      </FormField>
      <FormField label="Status" htmlFor="notification-status">
        <Select
          id="notification-status"
          placeholder="All statuses"
          options={NOTIFICATION_READ_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          value={isRead}
          onChange={(e) =>
            onIsReadChange(e.target.value as "" | "true" | "false")
          }
        />
      </FormField>
      <div className="flex items-end">
        <Button size="sm" variant="outline" onClick={onClear}>
          Clear filters
        </Button>
      </div>
    </div>
  );
}
