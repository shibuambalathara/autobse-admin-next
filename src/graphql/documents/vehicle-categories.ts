import { gql } from "@apollo/client";

export const VEHICLE_CATEGORIES_QUERY = gql`
  query VehicleCategories {
    vehicleCategories {
      id
      name
      createdAt
      createdById
      updatedAt
    }
  }
`;

export const CREATE_VEHICLE_CATEGORY_MUTATION = gql`
  mutation CreateVehiclecategory(
    $createVehiclecategoryInput: CreateVehiclecategoryInput!
  ) {
    createVehiclecategory(
      createVehiclecategoryInput: $createVehiclecategoryInput
    ) {
      id
      name
      createdAt
      createdById
      updatedAt
    }
  }
`;

export const UPDATE_VEHICLE_CATEGORY_MUTATION = gql`
  mutation UpdateVehicleCategory(
    $where: VehicleCategoryWhereUniqueInput!
    $updateVehiclecategoryInput: UpdateVehiclecategoryInput!
  ) {
    updateVehicleCategory(
      where: $where
      updateVehiclecategoryInput: $updateVehiclecategoryInput
    ) {
      id
      name
    }
  }
`;
