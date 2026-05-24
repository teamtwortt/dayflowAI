import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/auth": "http://127.0.0.1:8000",
      "/events": "http://127.0.0.1:8000",
      "/tasks": "http://127.0.0.1:8000",
      "/briefing": "http://127.0.0.1:8000",
      "/users": "http://127.0.0.1:8000",
      "/health": "http://127.0.0.1:8000",
      "/ai": "http://127.0.0.1:8000",
    },
  },
});
