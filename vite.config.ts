import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://round8-backend-team-one.huma-volve.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
