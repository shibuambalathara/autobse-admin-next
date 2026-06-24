import { gql } from "@apollo/client";

export const VAHAN_JSON_QUERY = gql`
  query VahanJson($where: VahanDetailsWhereInput!) {
    getParivahanDataJson(where: $where)
  }
`;

export const CONFIDENTIAL_VAHAN_DATA_QUERY = gql`
  query ConfidentialVahanData($where: VahanDetailsWhereInput!) {
    getAllParivahanDataJson(where: $where)
  }
`;

export const DELETE_VAHAN_DETAILS_MUTATION = gql`
  mutation VahanDelete {
    deleteVahanDetails
  }
`;

export const CHALLAN_QUERY = gql`
  query Challan(
    $rcNumber: String!
    $chassisNum: String!
    $engineNum: String!
  ) {
    getProvahanChallanData(
      rc_number: $rcNumber
      chassis_num: $chassisNum
      engine_num: $engineNum
    )
  }
`;

export const CHALLAN_SUMMARY_QUERY = gql`
  query ChallanSummary(
    $rcNumber: String!
    $chassisNum: String!
    $engineNum: String!
  ) {
    getChallanSummaryFromJson(
      rc_number: $rcNumber
      chassis_num: $chassisNum
      engine_num: $engineNum
    )
  }
`;
