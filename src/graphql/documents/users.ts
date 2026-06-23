import { gql } from "@apollo/client";

export const USERS_QUERY = gql`
  query Users(
    $take: Int
    $skip: Int
    $orderBy: [UserOrderByInput!]
    $search: String
    $where: UserWhereUniqueInput
  ) {
    users(
      take: $take
      skip: $skip
      orderBy: $orderBy
      search: $search
      where: $where
    ) {
      users {
        openToken
        id
        createdById
        email
        role
        firstName
        BalanceEMDAmount
        pancardNo
        country
        state
        city
        userCategory
        status
        vehicleBuyingLimit
        paymentsCount
        createdAt
        idNo
        activeBids {
          id
        }
        states {
          id
          name
        }
        mobile
        lastName
        registrationExpiryDate
      }
      usersCount
    }
  }
`;

export const FILTERED_USERS_COUNT_QUERY = gql`
  query FilteredUsersCount($where: UserWhereUniqueInput, $search: String) {
    users(where: $where, search: $search) {
      usersCount
    }
  }
`;

export const PENDING_USERS_QUERY = gql`
  query PendingUsers(
    $where: PendingUserWhereInput
    $take: Int
    $skip: Int
    $orderBy: [PendingUserOrderByInput!]
    $search: String
  ) {
    getPendingUsers(
      where: $where
      take: $take
      skip: $skip
      orderBy: $orderBy
      search: $search
    ) {
      pendingUsersCount
      pendingUsers {
        id
        otp
        IdNo
        firstName
        lastName
        pancardNo
        mobile
        state
        createdAt
      }
    }
  }
`;

export const DELETED_USERS_QUERY = gql`
  query DeletedUsers(
    $take: Int
    $skip: Int
    $orderBy: [UserOrderByInput!]
    $where: UserWhereUniqueInput
    $search: String
  ) {
    deletedUsers(
      take: $take
      skip: $skip
      orderBy: $orderBy
      where: $where
      search: $search
    ) {
      deletedUserCount
      users {
        id
        idNo
        email
        username
        role
        firstName
        lastName
        mobile
        city
        state
        paymentsCount
        deletedById
        deletedAt
      }
    }
  }
`;

export const VIEW_USER_QUERY = gql`
  query viewUser($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      idNo
      registrationExpiryDate
      email
      vehicleBuyingLimit
      username
      role
      state
      firstName
      lastName
      businessName
      mobile
      BalanceEMDAmount
      pancardNo
      idProofNo
      country
      city
      openToken
      userCategory
      paymentsCount
      status
      states {
        id
        name
      }
      seller {
        id
        name
      }
      activeBids {
        id
      }
      tempToken
      aadharcard_front_image
      aadharcard_back_image
      driving_license_front_image
      driving_license_back_image
      pancard_image
    }
  }
`;

export { STATES_QUERY } from "@/graphql/documents/states";

export { SELLERS_QUERY } from "@/graphql/documents/sellers";

export const EMD_APPROVED_USERS_LIST_QUERY = gql`
  query emdApprovedUsersList(
    $where: UserEmdPaymentWhereInput
    $take: Int
    $skip: Int
  ) {
    emdApprovedUsers(where: $where, take: $take, skip: $skip) {
      usersCount
      users {
        id
        firstName
        state
        lastName
        mobile
        status
        createdAt
      }
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation AddUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      email
      username
      role
      firstName
      lastName
      mobile
      status
      city
      pancardNo
      BalanceEMDAmount
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($data: UpdateUserInput!, $where: UserWhereUniqueInput!) {
    updateUser(data: $data, where: $where) {
      email
      username
      role
      firstName
      lastName
      businessName
      mobile
      BalanceEMDAmount
      pancardNo
      idProofNo
      country
      city
      userCategory
      tempToken
      status
      openToken
      id
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($where: UserWhereUniqueInput!) {
    deleteUser(where: $where) {
      id
      role
      firstName
    }
  }
`;

export const RESTORE_USER_MUTATION = gql`
  mutation RestoreUser($where: UserWhereUniqueInput!) {
    restoreUser(where: $where) {
      id
      email
      firstName
    }
  }
`;

export const DELETE_USERS_BY_DATE_RANGE_MUTATION = gql`
  mutation DeleteUsersByDateRange($where: UsersDeleteWhereUniqueInput!) {
    DeleteUsersHardDelete(where: $where)
  }
`;

export const MOVE_USER_TO_POTENTIAL_CLIENT_MUTATION = gql`
  mutation MoveUserToPotentialClient($where: UserWhereUniqueInput!) {
    moveUserToPotentialClient(where: $where) {
      id
    }
  }
`;

export const ADMIN_RESET_USER_PASSWORD_MUTATION = gql`
  mutation UserResetPasswordByAdmin(
    $data: ResetPasswordInput!
    $where: WatchlistUniqueInput!
  ) {
    AdminResetUserPassword(data: $data, where: $where) {
      id
    }
  }
`;
