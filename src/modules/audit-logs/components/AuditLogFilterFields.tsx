"use client";

import { Button, Select } from "@/components/ui";
import { FormField } from "@/components/forms";
import {
  AUDIT_CHANGED_BY_ROLE_OPTIONS,
  AUDIT_ENTITY_TYPE_OPTIONS,
} from "@/modules/audit-logs/constants";
import type {
  AuditChangedByRole,
  AuditEntityType,
} from "@/modules/audit-logs/types";

interface AuditLogFilterFieldsProps {
  entityType: AuditEntityType | "";
  changedByRole: AuditChangedByRole | "";
  onEntityTypeChange: (value: AuditEntityType | "") => void;
  onChangedByRoleChange: (value: AuditChangedByRole | "") => void;
  onClear: () => void;
}

export function AuditLogFilterFields({
  entityType,
  changedByRole,
  onEntityTypeChange,
  onChangedByRoleChange,
  onClear,
}: AuditLogFilterFieldsProps) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <FormField label="Entity Type" htmlFor="audit-log-entity-type-filter">
        <Select
          id="audit-log-entity-type-filter"
          value={entityType}
          onChange={(event) =>
            onEntityTypeChange(event.target.value as AuditEntityType | "")
          }
          options={[
            { label: "All entity types", value: "" },
            ...AUDIT_ENTITY_TYPE_OPTIONS,
          ]}
        />
      </FormField>

      <FormField label="Changed By Role" htmlFor="audit-log-role-filter">
        <Select
          id="audit-log-role-filter"
          value={changedByRole}
          onChange={(event) =>
            onChangedByRoleChange(event.target.value as AuditChangedByRole | "")
          }
          options={[
            { label: "All roles", value: "" },
            ...AUDIT_CHANGED_BY_ROLE_OPTIONS,
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
