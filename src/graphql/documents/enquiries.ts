import { gql } from "@apollo/client";

export const ENQUIRIES_QUERY = gql`
  query Enquiries(
    $where: EnquiryWhereInput
    $orderBy: [EnquiryOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
  ) {
    Enquiries(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
    ) {
      enquiryCount
      enquiry {
        createdAt
        firstName
        id
        lastName
        message
        mobile
        state
        status
        updatedAt
      }
    }
  }
`;

export const UPDATE_ENQUIRY_MUTATION = gql`
  mutation UpdateEnquiry(
    $where: EnquiryWhereUniqueInput!
    $updateEnquiryInput: UpdateEnquiryInput!
  ) {
    updateEnquiry(where: $where, updateEnquiryInput: $updateEnquiryInput) {
      status
    }
  }
`;
