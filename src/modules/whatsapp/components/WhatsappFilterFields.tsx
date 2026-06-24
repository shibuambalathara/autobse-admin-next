"use client";

import { Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import {
  WHATSAPP_STATUS_OPTIONS,
  WHATSAPP_TEMPLATE_OPTIONS,
} from "@/modules/whatsapp/constants";
import type {
  WhatsappStatusValue,
  WhatsappTemplateValue,
} from "@/modules/whatsapp/constants";

interface WhatsappFilterFieldsProps {
  template: WhatsappTemplateValue | "";
  status: WhatsappStatusValue | "";
  eventNo: string;
  eventOptions: { label: string; value: string }[];
  onTemplateChange: (value: WhatsappTemplateValue | "") => void;
  onStatusChange: (value: WhatsappStatusValue | "") => void;
  onEventNoChange: (value: string) => void;
}

export function WhatsappFilterFields({
  template,
  status,
  eventNo,
  eventOptions,
  onTemplateChange,
  onStatusChange,
  onEventNoChange,
}: WhatsappFilterFieldsProps) {
  return (
    <>
      <FormField label="Template" htmlFor="whatsapp-filter-template">
        <Select
          id="whatsapp-filter-template"
          placeholder="All templates"
          options={[
            { label: "All templates", value: "" },
            ...WHATSAPP_TEMPLATE_OPTIONS.map((option) => ({
              label: option.label,
              value: option.value,
            })),
          ]}
          value={template}
          onChange={(e) =>
            onTemplateChange(e.target.value as WhatsappTemplateValue | "")
          }
        />
      </FormField>

      <FormField label="Status" htmlFor="whatsapp-filter-status">
        <Select
          id="whatsapp-filter-status"
          placeholder="All statuses"
          options={[
            { label: "All statuses", value: "" },
            ...WHATSAPP_STATUS_OPTIONS,
          ]}
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value as WhatsappStatusValue | "")
          }
        />
      </FormField>

      <FormField label="Event No" htmlFor="whatsapp-filter-event">
        <Select
          id="whatsapp-filter-event"
          placeholder="All events"
          options={[{ label: "All events", value: "" }, ...eventOptions]}
          value={eventNo}
          onChange={(e) => onEventNoChange(e.target.value)}
        />
      </FormField>
    </>
  );
}
