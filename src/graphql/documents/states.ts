import { gql } from "@apollo/client";

export const STATES_QUERY = gql`
  query States {
    States {
      id
      name
      createdAt
    }
  }
`;

export const CREATE_STATE_MUTATION = gql`
  mutation CreateState($createStateInput: CreateStateInput!) {
    createState(createStateInput: $createStateInput) {
      id
      name
    }
  }
`;
