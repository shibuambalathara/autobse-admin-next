import { gql } from "@apollo/client";

export const JOB_APPLICATIONS_LIST_QUERY = gql`
  query JobApplicationsList(
    $orderBy: [JobapplicationOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
    $where: JobapplicationWhereInput
  ) {
    jobs(
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
      where: $where
    ) {
      jobCount
      jobs {
        id
        jobApplicationNo
        coverLetter
        createdAt
        email
        dateOfBirth
        fullName
        mobile
        gender
        linkedinProfile
        status
        notes
        CV
        yearOfExperience
        career {
          id
          title
        }
      }
    }
  }
`;

export const SINGLE_JOB_APPLICATION_QUERY = gql`
  query SingleJobApplication($where: JobapplicationUniqueInput!) {
    job(where: $where) {
      id
      fullName
      email
      mobile
      yearOfExperience
      coverLetter
      CV
      address
      dateOfBirth
      gender
      linkedinProfile
      portfolioUrl
      notes
      status
      career {
        title
        id
      }
    }
  }
`;

export const UPDATE_JOB_APPLICATION_MUTATION = gql`
  mutation UpdateJobApplication(
    $data: UpdateJobapplicationInput!
    $where: JobapplicationUniqueInput!
  ) {
    updateJobapplication(data: $data, where: $where) {
      id
      status
      notes
    }
  }
`;
