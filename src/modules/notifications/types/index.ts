export type NotificationType =
  | "BID"
  | "EVENT"
  | "GENERAL"
  | "PAYMENT"
  | "SYSTEM"
  | "WATCHLIST";

export interface NotificationItem {
  id: string;
  notificationNo: number;
  userId: string;
  title: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface DeletedNotificationItem {
  id: string;
  notificationNo: number;
  title: string;
  type: NotificationType;
  message: string;
  createdBy?: { id: string } | null;
}

export interface NotificationWhereInput {
  type?: NotificationType;
  isRead?: boolean;
  userId?: string;
}

export interface NotificationByUserWhereInput {
  userId: string;
  type?: NotificationType;
  isRead?: boolean;
}

export interface NotificationsQueryVariables {
  where?: NotificationWhereInput;
  orderBy?: { createdAt: "ASC" | "DESC" }[];
  take?: number;
  skip?: number;
}

export interface NotificationsByUserQueryVariables {
  where: NotificationByUserWhereInput;
  orderBy?: { createdAt: "ASC" | "DESC" }[];
  take?: number;
  skip?: number;
}

export interface DeletedNotificationsQueryVariables {
  where?: NotificationWhereInput;
  orderBy?: { createdAt: "ASC" | "DESC" }[];
  take?: number;
  skip?: number;
  search?: string;
}

export interface NotificationsListResult {
  notifications: {
    notificationCount?: number | null;
    notifications: NotificationItem[];
  };
}

export interface NotificationsByUserResult {
  notificationByUser: {
    notificationCount?: number | null;
    unreadCount?: number | null;
    notifications: NotificationItem[];
  };
}

export interface DeletedNotificationsResult {
  deletedNotifications: {
    deletedNotificationCount?: number | null;
    notifications: DeletedNotificationItem[];
  };
}
