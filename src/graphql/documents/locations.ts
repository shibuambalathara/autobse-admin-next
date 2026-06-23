import { gql } from "@apollo/client";

export const LOCATIONS_FILTER_QUERY = gql`
  query LocationsFilter {
    locations {
      locations {
        id
        name
      }
    }
  }
`;

export const LOCATIONS_LIST_QUERY = gql`
  query LocationsList(
    $search: String
    $where: LocationWhereUniqueInput
    $take: Int
    $skip: Int
    $orderBy: [LocationOrderByInput!]
  ) {
    locations(
      search: $search
      where: $where
      take: $take
      skip: $skip
      orderBy: $orderBy
    ) {
      locations {
        id
        name
        country
        createdAt
        updatedAt
        createdById
        state {
          id
          name
        }
      }
      locationsCount
    }
  }
`;

export const CREATE_LOCATION_MUTATION = gql`
  mutation CreateLocation(
    $createLocationInput: CreateLocationInput!
    $stateId: String!
  ) {
    createLocation(createLocationInput: $createLocationInput, stateId: $stateId) {
      id
      name
      state {
        id
        name
      }
    }
  }
`;

export const UPDATE_LOCATION_MUTATION = gql`
  mutation UpdateLocation(
    $where: LocationWhereUniqueInput!
    $updateLocationInput: UpdateLocationInput!
  ) {
    updateLocation(where: $where, updateLocationInput: $updateLocationInput) {
      id
      name
      state {
        id
        name
      }
    }
  }
`;
