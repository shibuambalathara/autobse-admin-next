import { PageContainer } from "@/components/ui";
import { CreateCrmForm } from "@/modules/crm/forms/CreateCrmForm";

export function CreateCrmView() {
  return (
    <PageContainer
      title="Add Potential Buyer"
      description="Create a new CRM potential buyer record."
    >
      <div className="mx-auto w-full max-w-4xl">
        <CreateCrmForm />
      </div>
    </PageContainer>
  );
}
