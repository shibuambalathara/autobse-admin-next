import { PageContainer } from "@/components/ui";
import { CreateCrmForm } from "@/modules/crm/forms/CreateCrmForm";

export function CreateCrmView() {
  return (
    <PageContainer
      title="Add Buyer Lead"
      description="Create a new buyer lead record."
    >
      <div className="mx-auto w-full max-w-4xl">
        <CreateCrmForm />
      </div>
    </PageContainer>
  );
}
