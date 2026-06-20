import { gql } from "@apollo/client";

export const EVENT_VEHICLES_HEADER_QUERY = gql`
  query EventVehicles($where: EventWhereUniqueInput!) {
    event(where: $where) {
      id
      eventNo
      eventCategory
      endDate
      seller {
        name
      }
      location {
        name
      }
    }
  }
`;

export const VEHICLES_LIST_QUERY = gql`
  query VehiclesList(
    $orderBy: [VehicleOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
    $where: VehicleWhereUniqueInput
  ) {
    vehicles(
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
      where: $where
    ) {
      vehiclesCount
      vehicles {
        id
        lotNumber
        loanAgreementNo
        vehicleIndexNo
        registrationNumber
        model
        bidStatus
        bidStartTime
        bidTimeExpire
        totalBids
        image
        currentBidAmount
        currentBidUser {
          firstName
          lastName
        }
        event {
          seller {
            name
          }
        }
      }
    }
  }
`;

export const DELETE_VEHICLE_MUTATION = gql`
  mutation DeleteVehicle($where: VehicleWhereUniqueInput!) {
    deleteVehicle(where: $where) {
      id
      registrationNumber
      vehicleIndexNo
    }
  }
`;

export const UPDATE_VEHICLE_DATE_MUTATION = gql`
  mutation UpdateDate(
    $where: VehicleWhereUniqueInput!
    $updateVehicleInput: UpdateVehicleInput!
  ) {
    updateVehicle(where: $where, updateVehicleInput: $updateVehicleInput) {
      id
    }
  }
`;

export const CREATE_VEHICLE_STATUS_MUTATION = gql`
  mutation CreateVehicleStatus(
    $vehicleId: String!
    $createVehicleStatusInput: CreateVehiclestatusInput
  ) {
    createVehicleStatus(
      vehicleId: $vehicleId
      createVehicleStatusInput: $createVehicleStatusInput
    ) {
      id
      status
      vehicle {
        id
      }
    }
  }
`;
