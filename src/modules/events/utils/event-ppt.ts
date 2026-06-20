import { env } from "@/config/env";
import { getAccessToken } from "@/auth/auth-storage";

export async function getEventPptUrl(
  eventId: string,
  includeVahan: boolean
): Promise<string> {
  const baseUrl = env.baseUrl;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  }

  const token = getAccessToken();
  const headers: Record<string, string> = { Accept: "*/*" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const buildUrl = (jobId?: string) => {
    const url = new URL(`${baseUrl}/ppt/${eventId}`);
    url.searchParams.set("includeVahan", String(includeVahan));
    if (jobId) url.searchParams.set("jobId", jobId);
    return url.toString();
  };

  const parseMaybeJson = async (response: Response) => {
    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("application/json")) {
      return response.json().catch(() => null);
    }
    const text = await response.text().catch(() => "");
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  };

  const normalizeUrl = (urlLike: string) => {
    const trimmed = urlLike.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    if (trimmed.startsWith("/")) return `${baseUrl}${trimmed}`;
    return `${baseUrl}/${trimmed}`.replace(/([^:]\/)\/+/g, "$1");
  };

  const startRes = await fetch(buildUrl(), { method: "GET", headers });
  if (!startRes.ok) {
    const message = await startRes.text().catch(() => "");
    throw new Error(message || "Failed to start PPT generation");
  }

  const startPayload = await parseMaybeJson(startRes);
  const startObj =
    typeof startPayload === "object" && startPayload
      ? (startPayload as Record<string, unknown>)
      : null;
  const initialUrlRaw =
    startObj?.url ??
    startObj?.downloadUrl ??
    (startObj?.data as Record<string, unknown> | undefined)?.url ??
    (startObj?.result as Record<string, unknown> | undefined)?.url;

  if (typeof initialUrlRaw === "string" && initialUrlRaw.trim()) {
    return normalizeUrl(initialUrlRaw);
  }

  const jobIdRaw =
    startObj?.jobId ??
    (startObj?.data as Record<string, unknown> | undefined)?.jobId ??
    (startObj?.result as Record<string, unknown> | undefined)?.jobId ??
    (typeof startPayload === "string" ? startPayload : null);
  const jobId = typeof jobIdRaw === "string" ? jobIdRaw : "";
  if (!jobId) {
    throw new Error("PPT generation started but jobId is missing in response");
  }

  const pollIntervalMs = 8000;
  const hardTimeoutMs = 20 * 60 * 1000;
  const startedAt = Date.now();

  while (Date.now() - startedAt < hardTimeoutMs) {
    const statusRes = await fetch(buildUrl(jobId), { method: "GET", headers });
    if (!statusRes.ok) {
      const message = await statusRes.text().catch(() => "");
      throw new Error(message || "Failed to fetch PPT status");
    }

    const contentType = (statusRes.headers.get("content-type") || "").toLowerCase();
    if (
      contentType &&
      !contentType.includes("application/json") &&
      !contentType.includes("text")
    ) {
      const blob = await statusRes.blob();
      return URL.createObjectURL(blob);
    }

    const payload = await parseMaybeJson(statusRes);

    if (typeof payload === "string") {
      const maybeUrl = normalizeUrl(payload);
      if (maybeUrl) return maybeUrl;
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
      continue;
    }

    const obj =
      typeof payload === "object" && payload
        ? (payload as Record<string, unknown>)
        : null;
    const dataObj = obj?.data as Record<string, unknown> | undefined;
    const urlRaw =
      obj?.url ??
      obj?.downloadUrl ??
      (obj?.result as Record<string, unknown> | undefined)?.url ??
      dataObj?.url ??
      (dataObj?.result as Record<string, unknown> | undefined)?.url ??
      dataObj?.downloadUrl ??
      obj?.link ??
      obj?.download_link ??
      obj?.pptUrl ??
      obj?.fileUrl ??
      (obj?.file as Record<string, unknown> | undefined)?.url ??
      obj?.data;

    if (typeof urlRaw === "string" && urlRaw.trim()) {
      return normalizeUrl(urlRaw);
    }

    const stateRaw = obj?.status ?? obj?.state ?? obj?.jobState;
    const state = typeof stateRaw === "string" ? stateRaw.toLowerCase() : "";
    const readyFlag = obj?.ready === true || dataObj?.ready === true;
    if (state === "failed" || state === "error") {
      throw new Error(
        typeof obj?.message === "string" ? obj.message : "PPT generation failed"
      );
    }

    if (readyFlag) {
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(2000, pollIntervalMs))
      );
      continue;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error("PPT generation timed out. Please try again.");
}
