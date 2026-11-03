import axios from "axios";

export const readToken = () => {
  const stored = localStorage.getItem("tokennn");
  if (!stored) return null;
  try {
    const token = JSON.parse(stored);
    return typeof token === "string" && token.trim() ? token : null;
  } catch {
    return null;
  }
};
export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "https://sandbox.academiadevelopers.com").replace(/\/$/, ""),
  timeout: 15000,
});
api.interceptors.request.use((config) => {
  const token = readToken();
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && !error.config?.url?.includes("api-auth")) {
    window.dispatchEvent(new Event("teamhub:session-expired"));
  }
  return Promise.reject(error);
});
export const errorText = (error, fallback = "No se pudo completar la operación. Intenta nuevamente.") => {
  const data = error.response?.data;
  if (typeof data === "string" && !data.includes("<")) return data;
  if (data && typeof data === "object") {
    const text = Object.values(data).flat().filter((value) => typeof value === "string").join(" ");
    if (text) return text;
  }
  return fallback;
};
// Follow API pagination without forwarding credentials to a different origin.
export const getAll = async (path, config = {}) => {
  const items = [];
  let next = path;
  const visited = new Set();
  while (next && !visited.has(next)) {
    visited.add(next);
    const response = await api.get(next, config);
    const data = response.data;
    items.push(...(Array.isArray(data) ? data : data.results || []));
    next = Array.isArray(data) ? null : data.next;
    if (next) {
      const url = new URL(next, api.defaults.baseURL);
      if (url.origin !== new URL(api.defaults.baseURL).origin) throw new Error("Invalid pagination origin");
      next = url.pathname + url.search;
      config = { ...config, params: undefined };
    }
  }
  return items;
};
