import { env } from "@/config/env";
import { getAccessToken } from "@/auth/auth-storage";

export type EventUploadType =
  | "upload"
  | "update"
  | "images"
  | "zip"
  | "eventbot";

export interface EventUploadConfig {
  title: string;
  accept: string;
  description: string;
}

const UPLOAD_CONFIG: Record<
  EventUploadType,
  EventUploadConfig & { url: string; method: "POST" | "PUT" }
> = {
  upload: {
    url: "/fileupload/event_vehicle_excel",
    method: "POST",
    title: "Vehicles",
    accept: ".xlsx,.xls",
    description: "Upload a vehicle list Excel file for this event.",
  },
  update: {
    url: "/fileupload/event_vehicle_excel-update",
    method: "PUT",
    title: "Edit Vehicles",
    accept: ".xlsx,.xls",
    description: "Update existing vehicles using an Excel file.",
  },
  images: {
    url: "/fileupload/vehicle_images_excel",
    method: "POST",
    title: "Vehicle Images",
    accept: ".xlsx,.xls",
    description: "Upload an Excel file to map and upload vehicle images.",
  },
  zip: {
    url: "/fileupload/event_zip",
    method: "PUT",
    title: "RAR/ZIP",
    accept: ".zip,.rar",
    description: "Upload a compressed archive of vehicle images.",
  },
  eventbot: {
    url: "/fileupload/excelfile/autogenerate",
    method: "POST",
    title: "EventBot Vehicles",
    accept: ".xlsx,.xls",
    description: "Upload a vehicle list Excel file for this EventBot.",
  },
};

export const EVENT_UPLOAD_TYPES = Object.keys(UPLOAD_CONFIG) as EventUploadType[];

export function isEventUploadType(value: string): value is EventUploadType {
  return EVENT_UPLOAD_TYPES.includes(value as EventUploadType);
}

export function getEventUploadConfig(type: EventUploadType): EventUploadConfig {
  const { title, accept, description } = UPLOAD_CONFIG[type];
  return { title, accept, description };
}

export async function uploadEventFile(
  type: EventUploadType,
  eventId: string,
  file: File
): Promise<void> {
  const config = UPLOAD_CONFIG[type];
  const formData = new FormData();
  formData.append("file", file);
  if (type === "eventbot") {
    formData.append("autogenerateEventId", eventId);
  } else {
    formData.append("eventId", eventId);
  }

  const token = getAccessToken();
  const response = await fetch(`${env.apiBaseUrl}${config.url}`, {
    method: config.method,
    headers: { authorization: token ? `Bearer ${token}` : "" },
    body: formData,
  });

  let result: { success?: boolean; message?: string } = {};
  try {
    result = await response.json();
  } catch {
    // ignore non-json responses
  }

  if (!response.ok) {
    throw new Error(result.message || `Upload failed: ${response.status}`);
  }
}
