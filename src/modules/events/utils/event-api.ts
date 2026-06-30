import { env } from "@/config/env";
import { getAccessToken } from "@/auth/auth-storage";
import { getGraphqlErrorMessage } from "@/lib/graphql-errors";

type UploadResponsePayload = {
  success?: boolean;
  message?: string;
  errorCode?: number;
};

function getUploadErrorMessage(
  response: Response,
  payload: UploadResponsePayload
): string {
  if (payload.message || payload.errorCode != null) {
    return getGraphqlErrorMessage(payload.errorCode, payload.message);
  }

  if (!env.apiBaseUrl) {
    return "NEXT_PUBLIC_API_BASE_URL is not set.";
  }

  return `Document upload failed (${response.status}).`;
}

export async function uploadEventVehicleList(
  eventId: string,
  file: File
): Promise<void> {
  if (!env.apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("eventId", eventId);

  const token = getAccessToken();
  const headers: HeadersInit = {};
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${env.apiBaseUrl}/fileupload/vehicle_list_excel/${eventId}`,
    {
      method: "PUT",
      body: formData,
      headers,
    }
  );

  let payload: UploadResponsePayload = {};
  try {
    payload = (await response.json()) as UploadResponsePayload;
  } catch {
    payload = {};
  }

  if (!response.ok || payload.success === false) {
    throw new Error(getUploadErrorMessage(response, payload));
  }

  if (payload.success !== true) {
    throw new Error(
      getGraphqlErrorMessage(payload.errorCode, payload.message) ||
        "Downloadable file upload failed."
    );
  }
}

export async function sendEventWhatsAppNotification(
  eventId: string
): Promise<void> {
  if (!env.baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not set.");
  }

  const token = getAccessToken();
  const headers: HeadersInit = {};
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${env.baseUrl}/webhook/send-event-location-whatsapp/${eventId}`,
    {
      method: "POST",
      headers,
    }
  );

  if (!response.ok) {
    let message = "WhatsApp notification failed";
    try {
      const errData = await response.json();
      message = errData?.message || message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
}
