import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "ee88-2001-fb1-cb-94db-c427-1a2d-ce4-ecc8.ngrok-free.app",
      "localhost",
      "0.0.0.0",
    ],
  },
});
