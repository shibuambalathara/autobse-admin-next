import { env } from "@/config/env";
import { getAccessToken } from "@/auth/auth-storage";

export async function uploadEventVehicleList(
  eventId: string,
  file: File
): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("eventId", eventId);

  const token = getAccessToken();
  const response = await fetch(
    `${env.apiBaseUrl}/fileupload/vehicle_list_excel/${eventId}`,
    {
      method: "PUT",
      body: formData,
      headers: { authorization: token ? `Bearer ${token}` : "" },
    }
  );

  if (!response.ok) {
    throw new Error(`Document upload failed: ${response.status}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Upload failed");
  }
}

export async function sendEventWhatsAppNotification(
  eventId: string
): Promise<void> {
  if (!env.baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not set.");
  }

  const token = getAccessToken();
  const response = await fetch(
    `${env.baseUrl}/webhook/send-event-location-whatsapp/${eventId}`,
    {
      method: "POST",
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
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
