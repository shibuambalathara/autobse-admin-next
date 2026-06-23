export interface VehicleCategory {
  id: string;
  name: string;
  createdAt?: string | null;
  createdById?: string | null;
  updatedAt?: string | null;
}

export interface VehicleCategoriesResult {
  vehicleCategories: VehicleCategory[];
}

export interface CreateVehicleCategoryFormValues {
  name: string;
}

export interface EditVehicleCategoryFormValues {
  name: string;
}
