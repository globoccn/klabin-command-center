const rawBaseUrl = String(import.meta.env.VITE_KLABIN_API_BASE_URL ?? "").trim();
const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  if (!API_BASE_URL) throw new ApiError("Defina VITE_KLABIN_API_BASE_URL para conectar o frontend aos webhooks do n8n.");
  const url = new URL(`${API_BASE_URL}/${path.replace(/^\//, "")}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });
  return url;
}

async function parseError(response: Response, path: string) {
  const body = await response.json().catch(async () => ({ message: await response.text().catch(() => "") }));
  throw new ApiError(body?.message ?? body?.error ?? `Falha ao consultar ${path}.`, response.status, body);
}

export async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>, options?: { signal?: AbortSignal }): Promise<T> {
  const response = await fetch(buildUrl(path, params), { method: "GET", headers: { Accept: "application/json" }, signal: options?.signal });
  if (!response.ok) return parseError(response, path);
  return (await response.json()) as T;
}

export async function apiPost<T>(path: string, body: unknown, options?: { signal?: AbortSignal }): Promise<T> {
  const response = await fetch(buildUrl(path), { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(body), signal: options?.signal });
  if (!response.ok) return parseError(response, path);
  return (await response.json()) as T;
}

export async function apiDownload(path: string): Promise<{ blob: Blob; fileName: string }> {
  const response = await fetch(buildUrl(path), { method: "GET", headers: { Accept: "application/pdf" } });
  if (!response.ok) return parseError(response, path);
  const disposition = response.headers.get("content-disposition") ?? "";
  const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const plain = disposition.match(/filename="?([^";]+)"?/i)?.[1];
  return { blob: await response.blob(), fileName: encoded ? decodeURIComponent(encoded) : plain ?? "relatorio-klabin.pdf" };
}

export function getApiBaseUrl() { return API_BASE_URL; }
