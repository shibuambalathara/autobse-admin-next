import { gql } from "@apollo/client";

export const SCHEDULE_CALLS_LIST_QUERY = gql`
  query ScheduleCallsList(
    $where: SchedulecallWhereInput
    $orderBy: [SchedulecallOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
  ) {
    scheduleCalls(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
    ) {
      schedulecallCount
      schedulecalls {
        id
        fullName
        email
        mobile
        ScheduleNo
        PreferredDate
        message
        createdAt
        status
        state
      }
    }
  }
`;

export const DELETED_SCHEDULE_CALLS_QUERY = gql`
  query DeletedScheduleCalls(
    $orderBy: [SchedulecallOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
    $where: SchedulecallWhereInput
  ) {
    deletedSchedulecalls(
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
      where: $where
    ) {
      deletedSchedulecallCount
      schedulecalls {
        id
        fullName
        email
        message
        mobile
        ScheduleNo
        PreferredDate
        status
        createdAt
        state
      }
    }
  }
`;

export const UPDATE_SCHEDULE_CALL_MUTATION = gql`
  mutation UpdateScheduleCall(
    $where: SchedulecallWhereUniqueInput!
    $data: UpdateSchedulecallInput!
  ) {
    updateSchedulecall(where: $where, data: $data) {
      id
    }
  }
`;

export const DELETE_SCHEDULE_CALL_MUTATION = gql`
  mutation DeleteScheduleCall($where: SchedulecallWhereUniqueInput!) {
    deleteSchedulecall(where: $where) {
      id
    }
  }
`;

export const RESTORE_SCHEDULE_CALL_MUTATION = gql`
  mutation RestoreScheduleCall($where: SchedulecallWhereUniqueInput!) {
    restoreSchedulecall(where: $where) {
      id
    }
  }
`;
