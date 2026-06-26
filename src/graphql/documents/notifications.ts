import { gql } from "@apollo/client";

export const NOTIFICATIONS_LIST_QUERY = gql`
  query NotificationsList(
    $where: NotificationWhereInput
    $orderBy: [NotificationOrderByInput!]
    $take: Int
    $skip: Int
  ) {
    notifications(where: $where, orderBy: $orderBy, take: $take, skip: $skip) {
      notificationCount
      notifications {
        id
        notificationNo
        userId
        title
        type
        message
        isRead
        createdAt
        updatedAt
      }
    }
  }
`;

export const NOTIFICATIONS_BY_USER_QUERY = gql`
  query NotificationsByUser(
    $where: NotificationNyUserWhereInput!
    $orderBy: [NotificationOrderByInput!]
    $take: Int
    $skip: Int
  ) {
    notificationByUser(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
    ) {
      notificationCount
      unreadCount
      notifications {
        id
        userId
        notificationNo
        title
        type
        message
        isRead
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETED_NOTIFICATIONS_QUERY = gql`
  query DeletedNotifications(
    $where: NotificationWhereInput
    $orderBy: [NotificationOrderByInput!]
    $take: Int
    $skip: Int
    $search: String
  ) {
    deletedNotifications(
      where: $where
      orderBy: $orderBy
      take: $take
      skip: $skip
      search: $search
    ) {
      deletedNotificationCount
      notifications {
        id
        notificationNo
        title
        type
        message
        createdBy {
          id
        }
      }
    }
  }
`;

export const UPDATE_NOTIFICATION_MUTATION = gql`
  mutation UpdateNotification(
    $where: NotificationWhereUniqueInput!
    $updateNotificationInput: UpdateNotificationInput!
  ) {
    updateNotification(
      where: $where
      updateNotificationInput: $updateNotificationInput
    ) {
      id
      userId
    }
  }
`;

export const RESTORE_NOTIFICATION_MUTATION = gql`
  mutation RestoreNotification($where: NotificationUniqueInput!) {
    restoreNotification(where: $where) {
      id
    }
  }
`;
