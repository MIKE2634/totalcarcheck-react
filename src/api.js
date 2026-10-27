const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  const { token, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...rest.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Request failed");
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