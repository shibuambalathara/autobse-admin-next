import type { EventCategory, MetaEventType } from "@/modules/events/types";

export type BulkUploadStatus = "PENDING" | "COMPLETED" | "FAILED" | string;

export interface EventBotItem {
  id: string;
  eventCategory: EventCategory;
  sellerId: string;
  startDate: string;
  endDate: string;
  successCount?: number | null;
  errorCount?: number | null;
  status: BulkUploadStatus;
  metaEventId?: number | null;
  extraTime?: number | null;
  extraTimeTrigerIn?: number | null;
  gapInBetweenVehicles?: number | null;
  bidLock?: string | null;
  createdAt: string;
  createdById: string;
  noOfBids: number;
  termsAndConditions: string;
  metaEventType?: MetaEventType | null;
}

export interface DeletedEventBotItem {
  id: string;
  sellerId: string;
  createdAt: string;
  metaEventId?: number | null;
  eventCategory: EventCategory;
  successCount?: number | null;
  status: BulkUploadStatus;
  startDate: string;
  metaEventType?: MetaEventType | null;
}

export interface AutoEventWhereInput {
  sellerId?: string;
  eventCategory?: EventCategory;
  startDate?: string;
}

export interface AutoEventsListVariables {
  orderBy?: Array<Record<string, "ASC" | "DESC">>;
  take?: number;
  skip?: number;
  search?: string;
  where?: AutoEventWhereInput;
}

export interface AutoEventsListResult {
  AutoEvents: {
    autoEventCount?: number | null;
    autoEvents: EventBotItem[];
  };
}

export interface AutoEventByIdResult {
  autoEvent: EventBotItem | null;
}

export interface DeletedAutoEventsResult {
  deletedAutogenerateEvents: {
    deletedAutoEventCount?: number | null;
    autoEvents: DeletedEventBotItem[];
  };
}

export interface CreateAutoEventInput {
  eventCategory: EventCategory;
  bidLock: string;
  startDate: string;
  endDate: string;
  extraTime: number;
  extraTimeTrigerIn: number;
  gapInBetweenVehicles: number;
  noOfBids: number;
  metaEventId?: number | null;
  metaEventType?: MetaEventType | null;
  termsAndConditions: string;
}

export interface CreateAutoEventResult {
  AutoEventCreation?: string | null;
}

export interface UpdateAutoEventInput {
  sellerId?: string;
  eventCategory?: EventCategory;
  bidLock?: string | null;
  startDate?: string;
  endDate?: string;
  extraTime?: number | null;
  extraTimeTrigerIn?: number | null;
  gapInBetweenVehicles?: number | null;
  noOfBids?: number | null;
  metaEventId?: number | null;
  metaEventType?: MetaEventType | null;
  termsAndConditions?: string | null;
}
