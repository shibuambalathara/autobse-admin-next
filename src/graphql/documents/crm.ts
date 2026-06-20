import { gql } from "@apollo/client";

export const CRM_LIST_QUERY = gql`
  query CrmList(
    $search: String
    $skip: Int
    $take: Int
    $where: PotentialClientsWhereInput
    $orderBy: [PotentialClinetOrderByInput!]
  ) {
    potentialClients(
      search: $search
      skip: $skip
      take: $take
      where: $where
      orderBy: $orderBy
    ) {
      clientCount
      potentialClients {
        id
        idNo
        registeredUserId
        email
        firstName
        lastName
        mobile
        pancardNo
        createdAt
        updatedAt
        stateId
        createdById
        remarks
        buyerPreference
        status
        vehicleCategoryId
        vehicleCategory {
          id
          name
        }
        locationId
        location {
          id
          name
        }
        assignedStaff {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const CREATE_POTENTIAL_CLIENT_MUTATION = gql`
  mutation CreatePotentialClient(
    $createPotentialclientInput: CreatePotentialclientInput!
    $assignedStaffId: String
    $stateId: String
    $vehicleCategoryId: String
    $locationId: String
  ) {
    createPotentialClient(
      createPotentialclientInput: $createPotentialclientInput
      assignedStaffId: $assignedStaffId
      stateId: $stateId
      vehicleCategoryId: $vehicleCategoryId
      locationId: $locationId
    ) {
      id
    }
  }
`;

export const INDIVIDUAL_CRM_QUERY = gql`
  query IndividualCrm($where: PotentialClientsWhereUniqueInput!) {
    potentialClient(where: $where) {
      id
      idNo
      registeredUserId
      email
      firstName
      lastName
      mobile
      pancardNo
      createdAt
      updatedAt
      stateId
      createdById
      remarks
      buyerPreference
      status
      isRegisteredBuyer
      vehicleCategoryId
      vehicleCategory {
        id
        name
      }
      locationId
      location {
        id
        name
      }
      assignedStaffId
      assignedStaff {
        id
        firstName
        lastName
      }
    }
  }
`;

export const UPDATE_CRM_MUTATION = gql`
  mutation UpdateCrm(
    $where: PotentialClientsWhereUniqueInput!
    $updatePotentialclientInput: UpdatePotentialclientInput!
  ) {
    updatePotentialClient(
      where: $where
      updatePotentialclientInput: $updatePotentialclientInput
    ) {
      id
    }
  }
`;

export const DELETE_CRM_MUTATION = gql`
  mutation DeletePotentialClient($where: PotentialClientsWhereUniqueInput!) {
    deletePotentialClient(where: $where) {
      id
    }
  }
`;

export const RESTORE_CRM_MUTATION = gql`
  mutation RestoreClient($where: PotentialClientsWhereUniqueInput!) {
    restoreClient(where: $where) {
      id
    }
  }
`;

export const MOVE_POTENTIAL_CLIENT_TO_USER_MUTATION = gql`
  mutation MovePotentialClientToUser($where: PotentialClientsWhereUniqueInput!) {
    movePotentialClientToUser(where: $where) {
      id
    }
  }
`;

export const POTENTIAL_CLIENT_BASIC_INFO_QUERY = gql`
  query PotentialClientBasicInfoList(
    $where: PotentialClientsWhereInput
    $skip: Int
    $take: Int
  ) {
    potentialClientBasicInfo(where: $where, skip: $skip, take: $take) {
      potentialClientBasicInfo {
        id
        idNo
        firstName
        lastName
        mobile
        state {
          name
        }
      }
    }
  }
`;

export const DELETED_CRM_LIST_QUERY = gql`
  query DeletedPotentialClientsListing(
    $where: PotentialClientsWhereUniqueInput
    $search: String
    $skip: Int
    $take: Int
    $orderBy: [PotentialClinetOrderByInput!]
  ) {
    deletedPotentialClients(
      where: $where
      search: $search
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      deletedClientCount
      potentialClients {
        id
        registeredUserId
        email
        firstName
        lastName
        mobile
        createdAt
        updatedAt
        stateId
        assignedStaffId
        status
        isRegisteredBuyer
        buyerPreference
        createdById
      }
    }
  }
`;

export const FILTER_LOCATIONS_QUERY = gql`
  query FilterLocations($where: LocationWhereUniqueInput) {
    locations(where: $where) {
      locations {
        id
        name
      }
    }
  }
`;

export const STAFF_USERS_QUERY = gql`
  query StaffUsers(
    $take: Int
    $orderBy: [UserOrderByInput!]
    $where: UserWhereUniqueInput
  ) {
    users(take: $take, orderBy: $orderBy, where: $where) {
      users {
        id
        firstName
        lastName
        mobile
      }
    }
  }
`;

export const CRM_CALL_LOG_LIST_QUERY = gql`
  query PotentialClientCallLogList(
    $search: String
    $skip: Int
    $take: Int
    $orderBy: [PotentialClientCallLogOrderByInput!]
    $where: PotentialClientCallLogWhereInput
  ) {
    potentialClientCallLogs(
      search: $search
      skip: $skip
      take: $take
      orderBy: $orderBy
      where: $where
    ) {
      callLogCount
      callLogs {
        id
        potentialClientId
        staffId
        staff {
          firstName
          lastName
        }
        callStatus
        durationInSeconds
        remarks
        nextFollowUpAt
        createdById
        createdBy {
          id
          firstName
          lastName
        }
        updatedAt
        createdAt
      }
    }
  }
`;

export const ADD_CRM_CALL_LOG_MUTATION = gql`
  mutation AddPotentialClientCallLog(
    $createPotentialClientCallLogInput: CreatePotentialClientCallLogInput!
    $potentialClientId: String!
    $staffId: String
  ) {
    createPotentialClientCallLog(
      createPotentialClientCallLogInput: $createPotentialClientCallLogInput
      potentialClientId: $potentialClientId
      staffId: $staffId
    ) {
      id
    }
  }
`;

export const INDIVIDUAL_CRM_CALL_LOG_QUERY = gql`
  query IndividualPotentialClientCallLog(
    $where: PotentialClientCallLogWhereUniqueInput!
  ) {
    potentialClientCallLog(where: $where) {
      id
      potentialClientId
      staffId
      staff {
        firstName
        lastName
      }
      callStatus
      durationInSeconds
      remarks
      nextFollowUpAt
      createdById
      createdBy {
        id
      }
      updatedAt
      createdAt
      potentialClient {
        firstName
        id
      }
    }
  }
`;

export const UPDATE_CRM_CALL_LOG_MUTATION = gql`
  mutation UpdatePotentialClientCall(
    $where: PotentialClientCallLogWhereUniqueInput!
    $updatePotentialClientCallLogInput: UpdatePotentialClientCallLogInput!
  ) {
    updatePotentialClientCallLog(
      where: $where
      updatePotentialClientCallLogInput: $updatePotentialClientCallLogInput
    ) {
      id
    }
  }
`;

export const DELETE_CRM_CALL_LOG_MUTATION = gql`
  mutation DeletePotentialClientCall(
    $where: PotentialClientCallLogWhereUniqueInput!
  ) {
    deletePotentialClientCallLog(where: $where) {
      id
    }
  }
`;

export const DELETED_CRM_CALL_LOG_LIST_QUERY = gql`
  query DeletedPotentialClientCallLogs(
    $where: PotentialClientCallLogWhereInput
    $orderBy: [PotentialClientCallLogOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
  ) {
    deletedPotentialClientCallLogs(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
    ) {
      callLogCount
      callLogs {
        id
        potentialClientId
        staffId
        staff {
          firstName
          lastName
        }
        potentialClient {
          id
          firstName
          lastName
        }
        callStatus
        durationInSeconds
        remarks
        nextFollowUpAt
        createdById
        createdAt
        updatedAt
      }
    }
  }
`;

export const RESTORE_CRM_CALL_LOG_MUTATION = gql`
  mutation RestorePotentialClientCallLog(
    $where: PotentialClientCallLogWhereUniqueInput!
  ) {
    restorePotentialClientCallLog(where: $where) {
      id
    }
  }
`;
