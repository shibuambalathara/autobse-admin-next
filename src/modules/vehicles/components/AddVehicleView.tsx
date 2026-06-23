import { PageContainer } from "@/components/ui";
import { AddVehicleForm } from "@/modules/vehicles/forms/AddVehicleForm";

interface AddVehicleViewProps {
  eventId: string;
}

export function AddVehicleView({ eventId }: AddVehicleViewProps) {
  return (
    <PageContainer title="Add Vehicle" description="Add a new vehicle to this event.">
      <AddVehicleForm eventId={eventId} />
    </PageContainer>
  );
}
