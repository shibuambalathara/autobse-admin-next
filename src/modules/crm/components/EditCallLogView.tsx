"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer, Button } from "@/components/ui";
import { useAuth } from "@/auth/use-auth";
import { APP_ROLES, isRole } from "@/auth/roles";
import { ROUTES } from "@/constants/routes";
import { EditCallLogForm } from "@/modules/crm/forms/EditCallLogForm";

interface EditCallLogViewProps {
  callLogId: string;
}

export function EditCallLogView({ callLogId }: EditCallLogViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const canEdit =
    isRole(user?.role ?? null, APP_ROLES.ADMIN) ||
    isRole(user?.role ?? null, APP_ROLES.STAFF);
  const [isEditable, setIsEditable] = useState(false);

  if (!canEdit) {
    return (
      <PageContainer
        title="Edit Call Log"
        description="You do not have permission to edit call logs."
        actions={
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => router.push(ROUTES.crm)}
          >
            Back to CRM
          </Button>
        }
      >
        <p className="text-sm text-brand-600">
          Call log editing is restricted to admin and staff roles.
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Edit Call Log"
      description="View or update call log details."
      actions={
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setIsEditable((prev) => !prev)}
        >
          {isEditable ? "Cancel Edit" : "Enable Edit"}
        </Button>
      }
    >
      <div className="mx-auto w-full max-w-4xl">
        <EditCallLogForm
          callLogId={callLogId}
          isEditable={isEditable}
          onToggleEdit={() => setIsEditable((prev) => !prev)}
        />
      </div>
    </PageContainer>
  );
}
