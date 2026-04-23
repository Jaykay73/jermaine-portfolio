import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { chatApiPlugin } from "./plugins/chatApiPlugin.js";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), chatApiPlugin()],
    define: {
      // Expose the NextWord API URL to the frontend
      "import.meta.env.VITE_NEXTWORD_API_BASE_URL": JSON.stringify(
        env.NEXTWORD_API_BASE_URL || "https://jaykay73-nextword-pidgin-api.hf.space"
      ),
    },
  };
});

