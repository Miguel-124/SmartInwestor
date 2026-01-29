const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API_URL + path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${msg}`);
  }
  return res.json() as Promise<T>;
}
