import { EditVehicleForm } from "@/modules/vehicles/forms/EditVehicleForm";

interface EditVehicleViewProps {
  vehicleId: string;
}

export function EditVehicleView({ vehicleId }: EditVehicleViewProps) {
  return <EditVehicleForm vehicleId={vehicleId} />;
}
