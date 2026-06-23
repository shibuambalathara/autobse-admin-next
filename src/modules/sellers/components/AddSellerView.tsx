import { PageContainer } from "@/components/ui";
import { CreateSellerForm } from "@/modules/sellers/forms/CreateSellerForm";

export function AddSellerView() {
  return (
    <PageContainer
      title="Add Seller"
      description="Create a new seller company record."
    >
      <div className="mx-auto w-full max-w-4xl">
        <CreateSellerForm />
      </div>
    </PageContainer>
  );
}
