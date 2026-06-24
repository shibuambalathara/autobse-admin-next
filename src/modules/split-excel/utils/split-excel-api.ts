import { env } from "@/config/env";
import { getAccessToken } from "@/auth/auth-storage";
import { getGraphqlErrorMessage } from "@/lib/graphql-errors";

function downloadBlob(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

async function parseSplitExcelError(response: Response): Promise<string> {
  try {
    const errData = await response.json();
    return getGraphqlErrorMessage(errData?.errorCode, errData?.message);
  } catch {
    return "Failed to split excel.";
  }
}

export async function uploadAndSplitExcel(file: File): Promise<void> {
  if (!env.apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const token = getAccessToken();
  const response = await fetch(
    `${env.apiBaseUrl}/fileupload/excelfile/split`,
    {
      method: "POST",
      headers: { authorization: token ? `Bearer ${token}` : "" },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(await parseSplitExcelError(response));
  }

  const blob = await response.blob();
  downloadBlob(blob, "split-excel-files.zip");
}
