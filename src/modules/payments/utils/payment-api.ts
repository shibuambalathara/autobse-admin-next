import { env } from "@/config/env";
import { getAccessToken } from "@/auth/auth-storage";

export async function uploadPaymentImage(
  paymentId: string,
  file: File
): Promise<void> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${env.apiBaseUrl}/fileupload/paymentImg/${paymentId}`,
    {
      method: "PUT",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Image upload failed: ${response.status}`);
  }
}

export async function downloadPaymentProofImage(
  paymentId: string
): Promise<void> {
  const token = getAccessToken();
  const response = await fetch(
    `${env.apiBaseUrl}/fileupload/paymentImg/${paymentId}`,
    {
      headers: token ? { authorization: `Bearer ${token}` } : {},
    }
  );

  if (!response.ok) {
    throw new Error("Failed to download payment proof");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `payment-proof-${paymentId}.jpg`;
  link.click();
  URL.revokeObjectURL(url);
}

export function resolvePaymentImageUrl(
  image: string | { url?: string | null } | null | undefined
): string | null {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.url ?? null;
}

export function sanitizePaymentAmountInput(value: string): string {
  const digits = value.replace(/[^0-9]/g, "");
  return digits.slice(0, 8);
}

export function toDatetimeLocalValue(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
