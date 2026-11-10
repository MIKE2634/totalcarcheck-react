const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://totalcarcheck-api.mikaelmika263.workers.dev";

export async function apiRequest(path, options = {}) {
  const { token, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...rest.headers,
    },
  });

  const text = await response.text();
  let result = {};

  if (text.trim()) {
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(
        `Server returned invalid JSON (HTTP ${response.status}).`
      );
    }
  }

  if (!response.ok) {
    throw new Error(result.error || `Request failed (HTTP ${response.status}).`);
  }

  return result;
}

export const register = (email, password, full_name = "") =>
  apiRequest("/api/register", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name }),
  });

export const login = (email, password) =>
  apiRequest("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
