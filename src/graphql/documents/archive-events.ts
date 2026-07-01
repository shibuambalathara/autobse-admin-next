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

export const ARCHIVE_VEHICLE_DETAIL_QUERY = gql`
  query ArchiveVehicleDetail(
    $where: VehicleWhereUniqueInput
    $take: Int
    $skip: Int
  ) {
    vehiclesArchive(where: $where, take: $take, skip: $skip) {
      vehicles {
        id
        bidStatus
        registrationNumber
        loanAgreementNo
        repoDt
        make
        model
        varient
        lotNumber
        fuel
        rcStatus
        ownership
        kmReading
        insuranceStatus
        startPrice
        reservePrice
        city
        state
        area
        paymentTerms
        dateOfRegistration
        vehicleCondition
        chassisNo
        YOM
        quoteIncreament
        inspectionLink
        yardLocation
        image
        registeredOwnerName
        currentBidAmount
        startBidAmount
        bidStartTime
        bidTimeExpire
        totalBids
        createdAt
        event {
          id
          eventNo
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
