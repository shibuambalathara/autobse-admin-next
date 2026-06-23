import { gql } from "@apollo/client";

export const AUTO_EVENTS_LIST_QUERY = gql`
  query AutoEventsList(
    $orderBy: [AutogenerateOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
    $where: AutoEventwhereInput
  ) {
    AutoEvents(
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
      where: $where
    ) {
      autoEventCount
      autoEvents {
        id
        eventCategory
        sellerId
        startDate
        endDate
        successCount
        errorCount
        status
        metaEventId
        extraTime
        extraTimeTrigerIn
        gapInBetweenVehicles
        bidLock
        createdAt
        createdById
        noOfBids
        termsAndConditions
        metaEventType
      }
    }
  }
`;

export const AUTO_EVENT_BY_ID_QUERY = gql`
  query AutoEventById($where: AutoEventwhereUniqueInput!) {
    autoEvent(where: $where) {
      id
      eventCategory
      sellerId
      startDate
      endDate
      successCount
      errorCount
      status
      metaEventId
      extraTime
      extraTimeTrigerIn
      gapInBetweenVehicles
      bidLock
      createdAt
      createdById
      noOfBids
      termsAndConditions
      metaEventType
    }
  }
`;

export const DELETED_AUTO_EVENTS_QUERY = gql`
  query DeletedAutoEvents(
    $search: String
    $skip: Int
    $take: Int
    $orderBy: [AutogenerateOrderByInput!]
    $where: AutoEventwhereInput
  ) {
    deletedAutogenerateEvents(
      search: $search
      skip: $skip
      take: $take
      orderBy: $orderBy
      where: $where
    ) {
      deletedAutoEventCount
      autoEvents {
        id
        sellerId
        createdAt
        metaEventId
        eventCategory
        successCount
        status
        startDate
        metaEventType
      }
    }
  }
`;

export const CREATE_AUTO_EVENT_MUTATION = gql`
  mutation CreateAutoEvent(
    $sellerId: String!
    $input: AutoEventCreationInput!
  ) {
    AutoEventCreation(sellerId: $sellerId, input: $input)
  }
`;

export const UPDATE_AUTO_EVENT_MUTATION = gql`
  mutation UpdateAutoEvent(
    $where: AutoEventwhereUniqueInput!
    $input: AutoEventUpdateInput!
  ) {
    updateAutogenerateEvent(where: $where, input: $input) {
      id
    }
  }
`;

export const DELETE_AUTO_EVENT_MUTATION = gql`
  mutation DeleteAutoEvent($where: AutoEventwhereUniqueInput!) {
    deleteAutogenerateEvent(where: $where) {
      id
    }
  }
`;

export const RESTORE_AUTO_EVENT_MUTATION = gql`
  mutation RestoreAutoEvent($where: AutoEventwhereUniqueInput!) {
    restoreAutogenerateEvent(where: $where) {
      id
      eventCategory
    }
  }
`;

export const HARD_DELETE_AUTO_EVENT_MUTATION = gql`
  mutation HardDeleteAutoEvent($where: AutoEventwhereUniqueInput!) {
    permanentDeleteAutogenerateEvent(where: $where) {
      id
    }
  }
`;
