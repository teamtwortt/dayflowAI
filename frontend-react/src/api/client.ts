import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

if (import.meta.env.PROD && !baseURL.trim()) {
  // eslint-disable-next-line no-console
  console.error(
    "[DayFlow] VITE_API_BASE_URL is missing in this build. API calls go to the wrong host; set it in amplify.yml (env.variables) or Amplify Environment variables.",
  );
}

export const api = axios.create({
  baseURL,
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ detail?: string; error?: string; message?: string }>) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/" && localStorage.getItem("token")) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export function extractError(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { detail?: string | unknown; error?: string; message?: string }
      | undefined;
    if (typeof data?.detail === "string") return data.detail;
    if (data?.error) return data.error;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
