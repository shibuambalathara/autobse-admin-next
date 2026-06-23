import { PageContainer } from "@/components/ui";
import { EditSellerForm } from "@/modules/sellers/forms/EditSellerForm";

interface EditSellerViewProps {
  sellerId: string;
}

export function EditSellerView({ sellerId }: EditSellerViewProps) {
  return (
    <PageContainer
      title="Edit Seller"
      description="View or update seller company details."
    >
      <div className="mx-auto w-full max-w-4xl">
        <EditSellerForm sellerId={sellerId} />
      </div>
    </PageContainer>
  );
}
