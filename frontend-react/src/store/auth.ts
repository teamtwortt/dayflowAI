import { create } from "zustand";

interface AuthState {
  token: string | null;
  email: string | null;
  setSession: (token: string, email?: string | null) => void;
  clearSession: () => void;
}

const TOKEN_KEY = "token";
const EMAIL_KEY = "user_email";

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  email: localStorage.getItem(EMAIL_KEY),
  setSession: (token, email) => {
    localStorage.setItem(TOKEN_KEY, token);
    if (email) localStorage.setItem(EMAIL_KEY, email);
    set({ token, email: email ?? null });
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    set({ token: null, email: null });
  },
}));
