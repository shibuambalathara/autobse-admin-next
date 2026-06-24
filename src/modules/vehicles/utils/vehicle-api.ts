import { env } from "@/config/env";
import { getGraphqlErrorMessage } from "@/lib/graphql-errors";

async function parseUploadError(response: Response): Promise<string> {
  try {
    const errData = await response.json();
    return getGraphqlErrorMessage(errData?.errorCode, errData?.message);
  } catch {
    return "Image upload failed.";
  }
}

export async function uploadVehicleImages(
  loanAgreementNo: string,
  registrationNumber: string,
  files: File[]
): Promise<void> {
  const formData = new FormData();
  formData.append("loanAgreementNo", loanAgreementNo);
  formData.append("registrationNumber", registrationNumber);
  files.forEach((file) => formData.append("image", file));

  const response = await fetch(`${env.apiBaseUrl}/fileupload/vehicleImg`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseUploadError(response));
  }
}

export async function uploadVehicleImagesByUrl(
  loanAgreementNo: string,
  registrationNumber: string,
  imageUrls: string
): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/fileupload/vehicleImg/url`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      loanAgreementNo,
      registrationNumber,
      imageUrls,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseUploadError(response));
  }
}

export async function updateVehicleImageUrls(
  loanAgreementNo: string,
  registrationNumber: string,
  imageUrls: string[]
): Promise<void> {
  const response = await fetch(
    `${env.apiBaseUrl}/fileupload/vehicleImg/url/update`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loanAgreementNo,
        registrationNumber,
        imageUrls,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await parseUploadError(response));
  }
}

export async function downloadVehicleImage(
  index: number,
  loanAgreementNo: string,
  registrationNumber: string
): Promise<void> {
  const url = `${env.apiBaseUrl}/fileupload/vehicles/images/${index - 1}?loanAgreementNo=${encodeURIComponent(loanAgreementNo)}&registrationNumber=${encodeURIComponent(registrationNumber)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to download image.");
  }
  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = `${loanAgreementNo}_${registrationNumber}_${index}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}
