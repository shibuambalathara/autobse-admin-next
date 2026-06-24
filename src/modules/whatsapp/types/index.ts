import type { EventCategory } from "@/modules/events/types";
import type {
  WhatsappStatusValue,
  WhatsappTemplateValue,
} from "@/modules/whatsapp/constants";

export interface WhatsappEventBrief {
  id: string;
  eventNo: number;
  startDate?: string | null;
  seller?: { name?: string | null } | null;
  location?: { name?: string | null } | null;
}

export interface EventsBriefResult {
  events?: {
    events?: WhatsappEventBrief[] | null;
  } | null;
}

export interface WhatsappRecipient {
  id: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  firstName?: string | null;
  phoneNumber?: string | null;
  status?: string | null;
  templateName?: string | null;
  message?: string | null;
  event?: {
    eventNo?: number | null;
    seller?: { name?: string | null } | null;
    location?: { name?: string | null } | null;
  } | null;
  createdBy?: { id: string } | null;
}

export interface WhatsappRecipientsResult {
  whatsapp: {
    messageCount?: number | null;
    whatsapp: WhatsappRecipient[];
  };
}

export interface DeletedWhatsappResult {
  deletedWhatsapp: {
    messageCount?: number | null;
    deletedMessageCount?: number | null;
    whatsapp: WhatsappRecipient[];
  };
}

export interface WhatsappWhereInput {
  templateName?: WhatsappTemplateValue;
  status?: WhatsappStatusValue;
  event?: { eventNo?: number };
}

export interface WhatsappListFilters {
  template?: WhatsappTemplateValue;
  status?: WhatsappStatusValue;
  eventNo?: string;
}

export interface ApprovedVehiclePreview {
  headerImageUrl: string;
  registrationNumber: string;
  YOM: string;
  model: string;
  location: string;
  approvedPrice: string;
  contact: string;
}

export interface WhatsappUploadFormValues {
  template: WhatsappTemplateValue;
  eventId?: string;
  contactPerson?: string;
  dealerContact?: string;
  mobile?: string;
  headerImageUrl?: string;
  registrationNumber?: string;
  YOM?: string;
  model?: string;
  location?: string;
  approvedPrice?: string;
  contact?: string;
  uploadFile: FileList;
}

export interface EventsBriefVariables {
  orderBy?: Array<{ eventNo?: "ASC" | "DESC" }>;
  take?: number;
  where?: { eventCategory?: EventCategory };
}
