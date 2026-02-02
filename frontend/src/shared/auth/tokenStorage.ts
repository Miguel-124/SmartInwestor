const KEY = "smartinwestor_token";

export function setAuthToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(KEY);
}
