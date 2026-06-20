import { PageContainer } from "@/components/ui";
import { EditVehicleForm } from "@/modules/vehicles/forms/EditVehicleForm";

interface EditVehicleViewProps {
  vehicleId: string;
}

export function EditVehicleView({ vehicleId }: EditVehicleViewProps) {
  return (
    <PageContainer title="Edit Vehicle" description="View and update vehicle details.">
      <EditVehicleForm vehicleId={vehicleId} />
    </PageContainer>
  );
}
