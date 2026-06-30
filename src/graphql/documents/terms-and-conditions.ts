import { gql } from "@apollo/client";

export const TERMS_AND_CONDITIONS_LIST_QUERY = gql`
  query TermsAndConditionsList(
    $where: TermsAndConditionWhereInput
    $orderBy: [TermsAndConditionOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
  ) {
    getTermsAndConditions(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
    ) {
      termsAndConditionsCount
      termsAndConditions {
        id
        userId
        eventId
        createdById
        createdAt
        updatedAt
      }
    }
  }
`;

export const USER_ARCHIVED_TERMS_QUERY = gql`
  query UserArchivedTerms($where: TermsArchiveWhereInput) {
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
