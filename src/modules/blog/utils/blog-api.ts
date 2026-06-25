import { env } from "@/config/env";
import { getGraphqlErrorMessage } from "@/lib/graphql-errors";

async function parseBlogUploadError(response: Response): Promise<string> {
  try {
    const errData = await response.json();
    return getGraphqlErrorMessage(errData?.errorCode, errData?.message);
  } catch {
    return "Blog image upload failed.";
  }
}

export async function uploadBlogImage(blogId: string, file: File): Promise<void> {
  if (!env.apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${env.apiBaseUrl}/fileupload/blogImg/${blogId}`,
    {
      method: "PUT",
      body: formData,
    }
  );

  let payload: { success?: boolean; message?: string; errorCode?: number } = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok || !payload.success) {
    throw new Error(
      getGraphqlErrorMessage(payload.errorCode, payload.message) ||
        (await parseBlogUploadError(response))
    );
  }
}
