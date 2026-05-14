import { api } from "./client";
import type { AuthTokens } from "./types";

export async function register(
  email: string,
  password: string,
  name?: string,
): Promise<{ message: string }> {
  const { data } = await api.post("/auth/register", {
    email,
    password,
    name,
  });
  return data;
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>("/auth/login", { email, password });
  return data;
}

export async function confirm(email: string, code: string): Promise<{ message: string }> {
  const { data } = await api.post("/auth/confirm", { email, code });
  return data;
}

export async function resendConfirmation(email: string): Promise<{ message: string }> {
  const { data } = await api.post("/auth/resend", { email });
  return data;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string,
): Promise<{ message: string }> {
  const { data } = await api.post("/auth/reset-password", {
    email,
    code,
    new_password: newPassword,
  });
  return data;
}
