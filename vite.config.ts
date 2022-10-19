import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import neuPlugin from "./neuplugin";

// https://vitejs.dev/config/
export default defineConfig({
  root: "front",
  base: "./",
  plugins: [react(), neuPlugin()],

  server: {
    watch: {
      usePolling: true,
    },
  },
});
