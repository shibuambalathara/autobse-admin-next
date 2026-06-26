import { gql } from "@apollo/client";

export const ARCHIVE_EVENTS_QUERY = gql`
  query ArchiveEvents(
    $orderBy: [EventArchiveOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
    $where: EventArchiveWhereInput
  ) {
    eventArchived(
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
      where: $where
    ) {
      eventArchiveCount
      eventArchived {
        id
        eventCategory
        archivedAt
        endDate
        startDate
        eventNo
        vehiclesCount
        sellerId
        locationId
        vehicleCategoryId
        archivedBy {
          id
        }
      }
    }
  }
`;

export const ACR_ARCHIVE_QUERY = gql`
  query AcrArchive($eventId: String!) {
    getAcrArchive(eventId: $eventId)
  }
`;

export const ARCHIVE_VEHICLES_QUERY = gql`
  query ArchiveVehicles(
    $where: VehicleWhereUniqueInput
    $orderBy: [VehicleOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
  ) {
    vehiclesArchive(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
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
        images
        currentBidAmount
        createdAt
        currentBidUser {
          firstName
          lastName
        }
      }
    }
  }
`;

export const ARCHIVE_TERMS_QUERY = gql`
  query ArchiveTermsListing($where: TermsArchiveWhereInput) {
    termsAndConditionsArchive(where: $where) {
      termsAndConditionsArchiveCount
      termsAndConditionsArchive {
        id
        userId
        archivedAt
        archivedById
        eventArchiveId
        createdAt
        updatedAt
      }
    }
  }
`;
