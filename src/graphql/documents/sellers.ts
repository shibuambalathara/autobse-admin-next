import { gql } from "@apollo/client";

/** Lightweight seller list for dropdowns and filters. */
export const SELLERS_FILTER_QUERY = gql`
  query SellersFilter {
    sellers {
      id
      name
    }
  }
`;

/** Alias used by user module for auction-allowed seller options. */
export const SELLERS_QUERY = gql`
  query Sellers {
    sellers {
      id
      name
    }
  }
`;

export const SELLERS_LIST_QUERY = gql`
  query SellersList {
    sellers {
      id
      name
      contactPerson
      GSTNumber
      billingContactPerson
      mobile
      nationalHead
      logo
      createdAt
      updatedAt
      createdById
    }
  }
`;

export const SELLER_DETAIL_QUERY = gql`
  query Seller($where: SellerWhereUniqueInput!) {
    seller(where: $where) {
      id
      name
      contactPerson
      GSTNumber
      billingContactPerson
      mobile
      nationalHead
      logo
      createdAt
      updatedAt
      createdById
    }
  }
`;

export const CREATE_SELLER_MUTATION = gql`
  mutation CreateSeller($createSellerInput: CreateSellerInput!) {
    createSeller(createSellerInput: $createSellerInput) {
      id
      name
      contactPerson
      GSTNumber
      billingContactPerson
      mobile
      nationalHead
      logo
    }
  }
`;

export const UPDATE_SELLER_MUTATION = gql`
  mutation UpdateSeller(
    $where: SellerWhereUniqueInput!
    $updateSellerInput: UpdateSellerInput!
  ) {
    updateSeller(where: $where, updateSellerInput: $updateSellerInput) {
      id
      name
      contactPerson
      GSTNumber
      billingContactPerson
      mobile
      nationalHead
      logo
      createdAt
      updatedAt
      createdById
    }
  }
`;

export const SELLER_ACR_BY_END_DATE_QUERY = gql`
  query SellerAcrByEndDate($where: AcrWhereInput!) {
    getAcrBySellerAndEndDate(where: $where)
  }
`;
