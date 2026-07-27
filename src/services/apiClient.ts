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

export async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>, options?: { signal?: AbortSignal }): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError("Defina VITE_KLABIN_API_BASE_URL para conectar o frontend aos webhooks do n8n.");
  }

  const url = new URL(`${API_BASE_URL}/${path.replace(/^\//, "")}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: options?.signal,
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(body?.message ?? `Falha ao consultar ${path}.`, response.status, body);
  }

  return body as T;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
