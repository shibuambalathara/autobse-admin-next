import { gql } from "@apollo/client";

export const BID_DETAILS_QUERY = gql`
  query BidDetails($where: BidWhereUniqueInput!) {
    Bids(where: $where) {
      id
      amount
      bidVehicleId
      userId
      createdAt
      updatedAt
      user {
        openToken
        firstName
        mobile
        lastName
      }
      bidVehicle {
        lotNumber
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
  }
`;

export const CREATE_BID_MUTATION = gql`
  mutation CreateBid(
    $createBidInput: CreateBidInput!
    $bidVehicleId: String!
    $userUniqueInput: UserWhereUniqueInput
  ) {
    createBid(
      createBidInput: $createBidInput
      bidVehicleId: $bidVehicleId
      userUniqueInput: $userUniqueInput
    ) {
      id
      name
    }
  }
`;

export const DELETE_BID_MUTATION = gql`
  mutation DeleteBid(
    $where: DeleteBidWhereUniqueInput!
    $deleteBidInput: DeleteBidInput!
  ) {
    deleteBid(where: $where, deleteBidInput: $deleteBidInput) {
      id
    }
  }
`;

export const RESTORE_BID_MUTATION = gql`
  mutation RestoreBid(
    $where: DeleteBidWhereUniqueInput!
    $restoreBidInput: RestoreBidInput!
  ) {
    restoreBid(where: $where, restoreBidInput: $restoreBidInput) {
      id
    }
  }
`;

export const ACTIVE_BIDS_PER_USER_QUERY = gql`
  query ActiveBidsPerUser($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      firstName
      lastName
      activeBids {
        id
        createdAt
        updatedAt
        vehicleIndexNo
        registrationNumber
        bidStatus
        bidStartTime
        bidTimeExpire
        startBidAmount
        currentBidAmount
        totalBids
        currentBidUser {
          username
          firstName
          lastName
          pancardNo
          mobile
        }
        event {
          id
          eventNo
          seller {
            name
          }
        }
      }
    }
  }
`;

export const DELETED_BIDS_QUERY = gql`
  query BidsDeleted(
    $eventId: String
    $orderBy: [BidOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
  ) {
    deletedBids(
      eventId: $eventId
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
    ) {
      deletedbidsCount
      bids {
        id
        amount
        name
        createdAt
      }
    }
  }
`;

export const ARCHIVE_BIDS_QUERY = gql`
  query ArchiveBids($where: BidWhereUniqueInput!) {
    bidsArchive(where: $where) {
      amount
      createdById
      bidVehicle {
        id
        bidStatus
        registrationNumber
      }
      user {
        id
        firstName
        lastName
        mobile
        createdAt
        updatedAt
      }
    }
  }
`;
