import { gql } from "@apollo/client";

export const CAREERS_LIST_QUERY = gql`
  query CareersList(
    $where: CareerWhereInput
    $orderBy: [CareerOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
  ) {
    careers(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
    ) {
      careerCount
      deletedCareerCount
      careers {
        id
        applicationDeadline
        careerNo
        urgency
        category
        description
        location
        package
        requirement
        responsibilities
        title
        type
        yearOfExperience
        createdAt
        updatedAt
        createdBy {
          firstName
          lastName
          id
        }
      }
    }
  }
`;

export const DELETED_CAREERS_QUERY = gql`
  query DeletedCareers(
    $orderBy: [CareerOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
  ) {
    deletedCareers(
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
    ) {
      deletedCareerCount
      careers {
        id
        careerNo
        category
        urgency
        applicationDeadline
        description
        location
        package
        requirement
        responsibilities
        title
        type
        yearOfExperience
        createdAt
        updatedAt
        createdBy {
          firstName
          lastName
          id
        }
      }
    }
  }
`;

export const SINGLE_CAREER_QUERY = gql`
  query SingleCareer($where: CareerWhereUniqueInput!) {
    career(where: $where) {
      id
      applicationDeadline
      title
      urgency
      category
      type
      location
      yearOfExperience
      package
      description
      requirement
      responsibilities
      createdAt
      updatedAt
      createdById
      createdBy {
        firstName
      }
    }
  }
`;

export const DISTINCT_LOCATIONS_QUERY = gql`
  query DistinctLocations {
    distinctLocations
  }
`;

export const CREATE_CAREER_MUTATION = gql`
  mutation CreateCareer($data: CreateCareerInput!) {
    createCareer(data: $data) {
      id
    }
  }
`;

export const UPDATE_CAREER_MUTATION = gql`
  mutation UpdateCareer(
    $where: CareerWhereUniqueInput!
    $data: UpdateCareerInput!
  ) {
    updateCareer(where: $where, data: $data) {
      id
    }
  }
`;

export const DELETE_CAREER_MUTATION = gql`
  mutation DeleteCareer($where: CareerWhereUniqueInput!) {
    deleteCareer(where: $where) {
      id
    }
  }
`;

export const RESTORE_CAREER_MUTATION = gql`
  mutation RestoreCareer($where: CareerWhereUniqueInput!) {
    restoreCareer(where: $where) {
      id
    }
  }
`;
