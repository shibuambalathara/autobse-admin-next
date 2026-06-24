import { env } from "@/config/env";
import { getAccessToken } from "@/auth/auth-storage";
import {
  APPROVED_VEHICLE_TEMPLATE,
  DEALER_PROMOTION_TEMPLATE,
} from "@/modules/whatsapp/constants";

export async function uploadWhatsappExcel(
  formData: FormData,
  template: string
): Promise<void> {
  if (!env.baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not set.");
  }

  const isDealer = template === DEALER_PROMOTION_TEMPLATE;
  const isApprovedVehicle = template === APPROVED_VEHICLE_TEMPLATE;

  const endpoint = isDealer
    ? `${env.baseUrl}/webhook/whatsapp-excel-promotion`
    : isApprovedVehicle
      ? `${env.baseUrl}/webhook/whatsapp-approved-vehicle-excel`
      : `${env.baseUrl}/webhook/whatsapp-excel`;

  const token = getAccessToken();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const errJson = await response.json();
      message = errJson?.message ?? message;
    } catch {
      message = (await response.text().catch(() => message)) || message;
    }
    throw new Error(message);
  }

  const result = await response.json().catch(() => ({}));
  if (result.success === false) {
    throw new Error(result.message || "Upload failed");
  }
}
