import { env } from "@/config/env";
import { getAccessToken } from "@/auth/auth-storage";

export async function uploadPotentialClientExcel(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  const token = getAccessToken();
  const response = await fetch(
    `${env.apiBaseUrl}/fileupload/potential_client`,
    {
      method: "POST",
      headers: { authorization: token ? `Bearer ${token}` : "" },
      body: formData,
    }
  );

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
