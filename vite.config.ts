import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
  resolve: {
    dedupe: ["react", "react-dom", "react-router", "ra-core", "@tanstack/react-query"],
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
});
