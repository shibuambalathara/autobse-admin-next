import { gql } from "@apollo/client";

export const PAYMENTS_LIST_QUERY = gql`
  query Payments(
    $where: PaymentWhereUniqueInput
    $take: Int
    $skip: Int
    $search: String
    $orderBy: [PaymentOrderByInput!]
  ) {
    payments(
      where: $where
      take: $take
      skip: $skip
      search: $search
      orderBy: $orderBy
    ) {
      paymentsCount
      payments {
        id
        refNo
        amount
        description
        paymentCount
        status
        userId
        image
        createdAt
        updatedAt
        createdById
        registrationExpire
        paymentFor
        user {
          firstName
          lastName
          mobile
        }
        emdUpdate {
          id
        }
      }
    }
  }
`;

export const USER_PAYMENTS_QUERY = gql`
  query UserPayments(
    $where: PaymentWhereUniqueInput
    $orderBy: [PaymentOrderByInput!]
    $take: Int
    $skip: Int
  ) {
    payments(where: $where, orderBy: $orderBy, take: $take, skip: $skip) {
      paymentsCount
      payments {
        id
        refNo
        amount
        description
        status
        userId
        image
        createdAt
        updatedAt
        createdById
        registrationExpire
        paymentFor
        user {
          id
          firstName
          lastName
          mobile
        }
        emdUpdate {
          id
          vehicleBuyingLimitIncrement
        }
        createdBy {
          firstName
        }
      }
    }
  }
`;

export const PAYMENT_QUERY = gql`
  query Payment($where: PaymentWhereUniqueInput!) {
    payment(where: $where) {
      id
      user {
        firstName
        lastName
        username
        mobile
        vehicleBuyingLimit
      }
      refNo
      amount
      description
      status
      userId
      image
      createdAt
      updatedAt
      createdById
      registrationExpire
      paymentFor
    }
  }
`;

export const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePayment(
    $createPaymentInput: CreatePaymentInput!
    $userId: String
  ) {
    createPayment(createPaymentInput: $createPaymentInput, userId: $userId) {
      id
      refNo
      amount
      description
      status
      userId
      paymentFor
    }
  }
`;

export const UPDATE_PAYMENT_MUTATION = gql`
  mutation UpdatePayment(
    $where: PaymentWhereUniqueInput!
    $updatePaymentInput: UpdatePaymentInput!
  ) {
    updatePayment(where: $where, updatePaymentInput: $updatePaymentInput) {
      id
      amount
      description
      status
      registrationExpire
      paymentFor
    }
  }
`;

export const CREATE_PAYMENT_STATUS_MUTATION = gql`
  mutation createPaymentStatus($createStatusInput: CreateStatusInput!) {
    createPaymentStatus(createStatusInput: $createStatusInput) {
      status
      id
    }
  }
`;

export const PAYMENT_HISTORY_QUERY = gql`
  query PaymentHistory($where: PaymentWhereUniqueInput!) {
    payment(where: $where) {
      refNo
      amount
      paymentFor
      statuspayment {
        id
        status
        comment
        createdAt
        createdById
        createdBy {
          firstName
        }
      }
    }
  }
`;

export const EMD_TABLE_QUERY = gql`
  query EmdTable($where: PaymentWhereUniqueInput!) {
    payment(where: $where) {
      id
      refNo
      paymentFor
      emdUpdate {
        id
        emdNo
        vehicleBuyingLimitIncrement
        createdAt
        createdBy {
          id
          firstName
        }
        payment {
          amount
        }
      }
    }
  }
`;

export const CREATE_EMD_UPDATE_MUTATION = gql`
  mutation CreateEmdupdate(
    $paymentId: String!
    $userId: String!
    $createEmdupdateInput: CreateEmdupdateInput!
  ) {
    createEmdupdate(
      paymentId: $paymentId
      userId: $userId
      createEmdupdateInput: $createEmdupdateInput
    ) {
      id
      vehicleBuyingLimitIncrement
    }
  }
`;

export const USER_BUYING_LIMIT_QUERY = gql`
  query UserBuyingLimit($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      firstName
      lastName
      emdUpdates {
        id
        emdNo
        vehicleBuyingLimitIncrement
        createdAt
        createdById
        createdBy {
          id
          firstName
        }
        payment {
          id
          amount
        }
      }
    }
  }
`;
