import { env } from "@/config/env";
import { getAccessToken } from "@/auth/auth-storage";

export interface AddUserDocumentPayload {
  pancardImage?: File;
  idProof?: File;
  idBack?: File;
  drivingLicenseFront?: File;
  drivingLicenseBack?: File;
}

export async function uploadUserDocuments(
  userId: string,
  files: AddUserDocumentPayload
): Promise<void> {
  const formData = new FormData();

  if (files.pancardImage) {
    formData.append("pancard_image", files.pancardImage);
  }
  if (files.idProof) {
    formData.append("aadharcard_front_image", files.idProof);
  }
  if (files.idBack) {
    formData.append("aadharcard_back_image", files.idBack);
  }
  if (files.drivingLicenseFront) {
    formData.append("driving_license_front_image", files.drivingLicenseFront);
  }
  if (files.drivingLicenseBack) {
    formData.append("driving_license_back_image", files.drivingLicenseBack);
  }

  const response = await fetch(
    `${env.apiBaseUrl}/fileupload/userprofile/${userId}`,
    {
      method: "PUT",
      body: formData,
      headers: { "x-apollo-operation-name": "uploadUserProfile" },
    }
  );

  if (!response.ok) {
    throw new Error(`Image upload failed: ${response.status}`);
  }
}

export async function uploadUserProfileFiles(
  userId: string,
  fileMap: Record<string, File | null>
): Promise<boolean> {
  const formData = new FormData();
  let hasFiles = false;

  Object.entries(fileMap).forEach(([key, file]) => {
    if (file) {
      formData.append(key, file);
      hasFiles = true;
    }
  });

  if (!hasFiles) return false;

  const response = await fetch(
    `${env.apiBaseUrl}/fileupload/userprofile/${userId}`,
    {
      method: "PUT",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Image upload failed: ${response.status}`);
  }

  return true;
}

export async function downloadIdentityImage(
  userId: string,
  imageKey: string
): Promise<void> {
  const token = getAccessToken();
  const response = await fetch(
    `${env.apiBaseUrl}/fileupload/users/${userId}/images/${imageKey}`,
    {
      headers: token ? { authorization: `Bearer ${token}` } : {},
    }
  );

  if (!response.ok) {
    throw new Error("Failed to download image");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${imageKey}.jpg`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function sendRegistrationExpiryWhatsapp(
  userId: string,
  contact: string
): Promise<void> {
  if (!env.baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not set.");
  }

  const token = getAccessToken();
  const body = new URLSearchParams({ contact: contact.trim() });

  const response = await fetch(
    `${env.baseUrl}/webhook/send-registration-expiry-whatsapp/${userId}`,
    {
      method: "POST",
      headers: {
        authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    }
  );

  if (!response.ok) {
    let message = "Failed to send WhatsApp notification";
    try {
      const errData = await response.json();
      message = errData?.message || message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
}
