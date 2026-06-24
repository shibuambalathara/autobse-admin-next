import { gql } from "@apollo/client";

export const WHATSAPP_RECIPIENTS_QUERY = gql`
  query WhatsappRecipients(
    $where: WhatsappWhereInput
    $orderBy: [WhatsappOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
  ) {
    whatsapp(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
    ) {
      messageCount
      whatsapp {
        id
        createdAt
        updatedAt
        firstName
        phoneNumber
        status
        templateName
        event {
          eventNo
          seller {
            name
          }
          location {
            name
          }
        }
        createdBy {
          id
        }
      }
    }
  }
`;

export const DELETED_WHATSAPP_QUERY = gql`
  query DeletedWhatsapp(
    $where: WhatsappWhereInput
    $orderBy: [WhatsappOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
  ) {
    deletedWhatsapp(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
    ) {
      messageCount
      deletedMessageCount
      whatsapp {
        id
        createdAt
        firstName
        phoneNumber
        status
        templateName
        message
        event {
          eventNo
          seller {
            name
          }
          location {
            name
          }
        }
        createdBy {
          id
        }
      }
    }
  }
`;

export const DELETE_WHATSAPP_MUTATION = gql`
  mutation DeleteWhatsapp($where: WhatsappUniqueInput!) {
    deleteWhatsapp(where: $where) {
      id
    }
  }
`;

export const RESTORE_WHATSAPP_MUTATION = gql`
  mutation RestoreWhatsapp($where: WhatsappUniqueInput!) {
    restoreWhatsapp(where: $where) {
      id
      firstName
    }
  }
`;

export const EVENTS_BRIEF_QUERY = gql`
  query EventsBrief(
    $orderBy: [EventOrderByInput!]
    $take: Int
    $where: EventWhereUniqueInput
  ) {
    events(orderBy: $orderBy, take: $take, where: $where) {
      events {
        id
        eventNo
        startDate
        seller {
          name
        }
        location {
          name
        }
      }
    }
  }
`;
