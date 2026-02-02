import { getAuthToken } from "../auth/tokenStorage";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function httpClient<TResponse>(
  path: string,
  options?: {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
  },
): Promise<TResponse> {
  const baseUrl =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
  const token = getAuthToken();

  const res = await fetch(`${baseUrl}${path}`, {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return (await res.json()) as TResponse;
}
