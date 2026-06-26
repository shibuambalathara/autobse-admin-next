export type AuditAction = "CREATE" | "DELETE" | "READ" | "RESTORE" | "UPDATE";

export type AuditEntityType =
  | "ACR"
  | "BID"
  | "BLOCKED_DEALER"
  | "BLOG"
  | "CALENDAR"
  | "CAREER"
  | "EMD_UPDATE"
  | "ENQUIRY"
  | "EVENT"
  | "EXCEL_UPLOAD"
  | "FIND_AUCTION"
  | "INSTITUTION"
  | "JOB_APPLICATION"
  | "LOCATION"
  | "NOTIFICATION"
  | "PAYMENT"
  | "PAYMENT_STATUS"
  | "SELLER"
  | "STATE"
  | "TERMS_AND_CONDITION"
  | "USER"
  | "VEHICLE"
  | "VEHICLE_CATEGORY"
  | "VEHICLE_STATUS";

export type AuditChangedByRole =
  | "accountant"
  | "admin"
  | "dealer"
  | "hr"
  | "seller"
  | "staff";

export interface AuditLog {
  id: string;
  entityId?: string | null;
  entityType?: AuditEntityType | string | null;
  action?: AuditAction | string | null;
  changedByRole?: AuditChangedByRole | string | null;
  changedByUserId?: string | null;
  changes?: unknown;
  createdAt?: string | null;
}

export interface AuditLogWhereInput {
  entityType?: AuditEntityType;
  changedByRole?: AuditChangedByRole | string;
  entityId?: string;
  changedByUserId?: string;
  action?: AuditAction;
}

export interface AuditLogsListResult {
  getAuditLogsList: {
    auditLogCount?: number | null;
    auditLogs: AuditLog[];
  };
}

export interface UserAuditLogsResult {
  userAuditLogs: {
    auditLogCount?: number | null;
    auditLogs: AuditLog[];
  };
}

export interface AuditLogsQueryVariables {
  where?: AuditLogWhereInput;
  search?: string;
  skip?: number;
  take?: number;
  orderBy?: Array<{ createdAt?: "ASC" | "DESC" }>;
}

export interface UserAuditLogsQueryVariables extends AuditLogsQueryVariables {
  userId: string;
}
