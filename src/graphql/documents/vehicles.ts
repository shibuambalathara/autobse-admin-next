import { gql } from "@apollo/client";

export const EVENT_VEHICLES_HEADER_QUERY = gql`
  query EventVehicles($where: EventWhereUniqueInput!) {
    event(where: $where) {
      id
      eventNo
      eventCategory
      endDate
      bidLock
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
        images
        currentBidAmount
        startPrice
        quoteIncreament
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

export const VEHICLE_QUERY = gql`
  query Vehicle($where: VehicleWhereUniqueInput!) {
    vehicle(where: $where) {
      id
      additionalData
      vehicleIndexNo
      registrationNumber
      bidTimeExpire
      bidStartTime
      bidAmountUpdate
      currentBidAmount
      startBidAmount
      loanAgreementNo
      registeredOwnerName
      quoteIncreament
      make
      model
      varient
      category
      fuel
      type
      rcStatus
      YOM
      ownership
      mileage
      kmReading
      insuranceStatus
      yardLocation
      startPrice
      reservePrice
      repoDt
      veicleLocation
      vehicleRemarks
      auctionManager
      parkingCharges
      insurance
      insuranceValidTill
      tax
      taxValidityDate
      fitness
      permit
      engineNo
      chassisNo
      images
      inspectionLink
      autobseContact
      autobse_contact_person
      vehicleCondition
      powerSteering
      shape
      color
      state
      city
      area
      paymentTerms
      dateOfRegistration
      hypothication
      climateControl
      doorCount
      gearBox
      buyerFees
      rtoFine
      parkingRate
      approxParkingCharges
      clientContactPerson
      clientContactNo
      additionalRemarks
      lotNumber
      bidStatus
      yardName
      yardState
      address
      pincode
      accidentalStatus
      vehicleKeyStatus
      event {
        id
        seller {
          name
        }
      }
    }
  }
`;

export const CREATE_VEHICLE_MUTATION = gql`
  mutation CreateVehicle(
    $eventId: String!
    $createVehicleInput: CreateVehicleInput!
  ) {
    createVehicle(eventId: $eventId, createVehicleInput: $createVehicleInput) {
      id
    }
  }
`;

export const UPDATE_VEHICLE_MUTATION = gql`
  mutation UpdateVehicle(
    $where: VehicleWhereUniqueInput!
    $updateVehicleInput: UpdateVehicleInput!
  ) {
    updateVehicle(where: $where, updateVehicleInput: $updateVehicleInput) {
      id
    }
  }
`;

export const RESTORE_VEHICLE_MUTATION = gql`
  mutation Restorevehicle($where: VehicleWhereUniqueInput!) {
    restorevehicle(where: $where) {
      id
      vehicleIndexNo
      registrationNumber
    }
  }
`;

export const DELETED_VEHICLES_QUERY = gql`
  query DeletedVehicles($eventId: String!) {
    deletedVehicles(eventId: $eventId) {
      id
      lotNumber
      loanAgreementNo
      vehicleIndexNo
      registrationNumber
      bidStatus
      totalBids
      event {
        eventNo
        seller {
          name
        }
      }
    }
  }
`;

export const VEHICLE_STATUS_HISTORY_QUERY = gql`
  query vehicleStatusHistory($where: VehicleWhereUniqueInput!) {
    vehicle(where: $where) {
      registrationNumber
      loanAgreementNo
      statusVehicle {
        id
        status
        createdAt
        createdBy {
          firstName
        }
      }
    }
  }
`;

export const OPEN_VEHICLE_BID_QUERY = gql`
  query OpenVehicleBid($where: VehicleWhereUniqueInput!) {
    vehicle(where: $where) {
      id
      loanAgreementNo
      registrationNumber
      quoteIncreament
      currentBidAmount
      startBidAmount
      startPrice
      state
    }
  }
`;
