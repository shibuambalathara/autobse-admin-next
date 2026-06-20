import { gql } from "@apollo/client";

export const NEW_EVENTS_LISTING_QUERY = gql`
  query NewEventsListing(
    $where: EventWhereUniqueInput
    $search: String
    $take: Int
    $skip: Int
    $orderBy: [EventOrderByInput!]
  ) {
    eventsData(
      where: $where
      search: $search
      take: $take
      skip: $skip
      orderBy: $orderBy
    ) {
      eventCount
      events {
        bidLock
        id
        createdById
        createdAt
        eventNo
        metaEventId
        metaEventType
        eventCategory
        startDate
        endDate
        status
        vehiclesCount
        deletedVehiclesCount
        vehicleCategory {
          name
        }
        seller {
          id
          name
        }
        location {
          id
          name
        }
      }
    }
  }
`;

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

export const SELLERS_FILTER_QUERY = gql`
  query SellersFilter {
    sellers {
      id
      name
    }
  }
`;

export const VEHICLE_CATEGORIES_QUERY = gql`
  query VehicleCategories {
    vehicleCategories {
      id
      name
    }
  }
`;

export const ARCHIVE_EVENT_MUTATION = gql`
  mutation ArchiveEventVehicleAndBid($eventId: String!) {
    archiveEvent(eventId: $eventId)
  }
`;

export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent(
    $vehicleCategoryId: String!
    $locationId: String!
    $createEventInput: CreateEventInput!
    $sellerId: String!
  ) {
    createEvent(
      vehicleCategoryId: $vehicleCategoryId
      locationId: $locationId
      createEventInput: $createEventInput
      sellerId: $sellerId
    ) {
      id
      metaEventType
    }
  }
`;

export const SINGLE_EVENT_QUERY = gql`
  query SingleEvent($where: EventWhereUniqueInput!) {
    event(where: $where) {
      id
      metaEventType
      eventNo
      eventCategory
      startDate
      endDate
      firstVehicleEndDate
      pauseDate
      pausedTotalTime
      sellerId
      vehicleCategoryId
      locationId
      noOfBids
      downloadableFile_filename
      termsAndConditions
      createdAt
      updatedAt
      createdById
      extraTimeTrigerIn
      extraTime
      vehicleLiveTimeIn
      gapInBetweenVehicles
      status
      bidLock
      autobseContactPerson
      autobseContact
      vehiclesCount
      metaEventId
    }
  }
`;

export const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent(
    $where: EventWhereUniqueInput!
    $updateEventInput: UpdateEventInput!
  ) {
    updateEvent(where: $where, updateEventInput: $updateEventInput) {
      id
      eventNo
    }
  }
`;

export const EVENT_FOR_ACR_QUERY = gql`
  query EventForACR($where: EventWhereUniqueInput!) {
    event(where: $where) {
      Report
    }
  }
`;
