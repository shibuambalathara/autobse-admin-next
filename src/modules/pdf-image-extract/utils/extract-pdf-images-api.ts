import { getAccessToken } from "@/auth/auth-storage";
import { env } from "@/config/env";

export type ExtractPdfImagesStartParams =
  | { file: File; url?: string }
  | { file?: File; url: string };

export type ExtractPdfImagesStartResponse = {
  jobId: string;
  message?: string;
};

export type ExtractPdfImagesStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "unknown";

export type ExtractPdfImagesStatusResponse = {
  jobId: string;
  status: ExtractPdfImagesStatus;
  message?: string;
  downloadUrl?: string;
  blob?: Blob;
  filename?: string;
  raw?: unknown;
};

function authHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { authorization: `Bearer ${token}` } : {};
}

function getBaseUrl(): string {
  return (env.apiBaseUrl || "").replace(/\/+$/, "");
}

function normalizeDownloadUrl(urlLike: string): string {
  const baseUrl = getBaseUrl();
  const trimmed = (urlLike || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) return `${baseUrl}${trimmed}`;
  return `${baseUrl}/${trimmed}`.replace(/([^:]\/)\/+/g, "$1");
}

function getFilenameFromResponse(response: Response): string {
  const disposition = response.headers.get("content-disposition") || "";
  const filenameMatch = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)"?/i);
  return filenameMatch?.[1] ? decodeURIComponent(filenameMatch[1]) : "";
}

function normalizeStatus(value: unknown): ExtractPdfImagesStatus {
  const v = typeof value === "string" ? value.toLowerCase() : "";
  if (v === "queued") return "queued";
  if (v === "processing" || v === "in_progress" || v === "in-progress") {
    return "processing";
  }
  if (v === "completed" || v === "success" || v === "done") return "completed";
  if (v === "failed" || v === "error") return "failed";
  return "unknown";
}

function pickDownloadUrl(payload: Record<string, unknown> | null): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;

  const candidates = [
    payload.downloadUrl,
    payload.downloadURL,
    payload.download_link,
    payload.downloadLink,
    payload.url,
    payload.link,
    (payload.data as Record<string, unknown> | undefined)?.downloadUrl,
    (payload.data as Record<string, unknown> | undefined)?.url,
    (payload.data as Record<string, unknown> | undefined)?.link,
    (payload.result as Record<string, unknown> | undefined)?.downloadUrl,
    (payload.result as Record<string, unknown> | undefined)?.url,
    (payload.result as Record<string, unknown> | undefined)?.link,
  ];

  const rawUrl = candidates.find((value) => typeof value === "string");
  return typeof rawUrl === "string" ? rawUrl : undefined;
}

async function parseMaybeJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.toLowerCase().includes("application/json")) {
    return await response.json().catch(() => null);
  }
  const text = await response.text().catch(() => "");
  try {
    return JSON.parse(text);
  } catch {
    return text || null;
  }
}

export function downloadExtractedZip(blob: Blob, filename = "pdf-extracted-images.zip"): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function startExtractPdfImages(
  params: ExtractPdfImagesStartParams
): Promise<
  | { kind: "job"; data: ExtractPdfImagesStartResponse }
  | { kind: "blob"; blob: Blob; filename?: string }
> {
  if (!env.apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set.");
  }

  const formData = new FormData();
  if ("file" in params && params.file) formData.append("file", params.file);
  if (params.url) formData.append("url", params.url);

  const response = await fetch(`${env.apiBaseUrl}/fileupload/extract-pdf-images`, {
    method: "POST",
    headers: authHeader(),
    body: formData,
  });

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    if (!response.ok) throw new Error("Failed to extract images from PDF");
    const blob = await response.blob();
    const filename = getFilenameFromResponse(response);
    return { kind: "blob", blob, filename };
  }

  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : "Failed to start PDF extraction job"
    );
  }

  const jobId =
    payload.jobId ??
    (payload.data as Record<string, unknown> | undefined)?.jobId ??
    (payload.result as Record<string, unknown> | undefined)?.jobId;

  if (!jobId || typeof jobId !== "string") {
    throw new Error("Job started but jobId is missing in response");
  }

  return {
    kind: "job",
    data: {
      jobId,
      message: typeof payload.message === "string" ? payload.message : undefined,
    },
  };
}

export async function getExtractPdfImagesStatus(
  jobId: string
): Promise<ExtractPdfImagesStatusResponse> {
  if (!env.apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set.");
  }

  const response = await fetch(
    `${env.apiBaseUrl}/fileupload/extract-pdf-images/excel/status/${encodeURIComponent(jobId)}`,
    {
      method: "GET",
      headers: authHeader(),
    }
  );

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "Failed to get extraction status");
  }

  const statusType = (response.headers.get("content-type") || "").toLowerCase();

  if (!statusType.includes("application/json") && !statusType.includes("text")) {
    const blob = await response.blob();
    const filename = getFilenameFromResponse(response);
    return {
      jobId,
      status: "completed",
      blob,
      filename,
    };
  }

  const payload = await parseMaybeJson(response);

  if (payload == null || payload === "null" || payload === "") {
    return { jobId, status: "processing" };
  }

  if (typeof payload === "string") {
    const maybeUrl = normalizeDownloadUrl(payload);
    return {
      jobId,
      status: maybeUrl ? "completed" : "processing",
      downloadUrl: maybeUrl || undefined,
      raw: payload,
    };
  }

  const record = payload as Record<string, unknown>;
  const status = normalizeStatus(
    record.status ?? record.state ?? (record.data as Record<string, unknown> | undefined)?.status
  );
  const rawUrl = pickDownloadUrl(record);
  const downloadUrl = rawUrl ? normalizeDownloadUrl(rawUrl) : undefined;

  return {
    jobId,
    status,
    message: typeof record.message === "string" ? record.message : undefined,
    downloadUrl,
    raw: payload,
  };
}

export type PollExtractPdfImagesStatusOptions = {
  intervalMs?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
  onUpdate?: (status: ExtractPdfImagesStatusResponse) => void;
};

export async function pollExtractPdfImagesStatus(
  jobId: string,
  opts: PollExtractPdfImagesStatusOptions = {}
): Promise<ExtractPdfImagesStatusResponse> {
  const intervalMs = opts.intervalMs ?? 2500;
  const timeoutMs = opts.timeoutMs ?? 10 * 60 * 1000;
  const start = Date.now();

  while (true) {
    if (opts.signal?.aborted) {
      throw new Error("Cancelled");
    }

    const status = await getExtractPdfImagesStatus(jobId);
    opts.onUpdate?.(status);

    if (status.status === "completed") return status;
    if (status.status === "failed") {
      throw new Error(status.message || "Extraction job failed");
    }

    if (Date.now() - start > timeoutMs) {
      throw new Error("Timed out waiting for extraction to complete");
    }

    await new Promise<void>((resolve) => setTimeout(resolve, intervalMs));
  }
}

export async function downloadFromExtractUrl(downloadUrl: string): Promise<void> {
  try {
    const fileRes = await fetch(downloadUrl, {
      method: "GET",
      headers: { Accept: "*/*" },
    });
    if (!fileRes.ok) throw new Error();
    const blob = await fileRes.blob();
    downloadExtractedZip(blob);
  } catch {
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
    throw new Error("Extraction completed. Download link opened in a new tab.");
  }
}
