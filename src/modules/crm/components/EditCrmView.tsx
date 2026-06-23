"use client";

import { useState } from "react";
import { PageContainer, Button } from "@/components/ui";
import { EditCrmForm } from "@/modules/crm/forms/EditCrmForm";

interface EditCrmViewProps {
  clientId: string;
}

export function EditCrmView({ clientId }: EditCrmViewProps) {
  const [isEditable, setIsEditable] = useState(false);

  return (
    <PageContainer
      title="Edit Potential Buyer"
      description="View or update potential buyer details."
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
        <EditCrmForm
          clientId={clientId}
          isEditable={isEditable}
          onToggleEdit={() => setIsEditable((prev) => !prev)}
        />
      </div>
    </PageContainer>
  );
}
