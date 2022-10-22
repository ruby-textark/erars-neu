import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import neuPlugin from "./neuplugin";

// https://vitejs.dev/config/
export default defineConfig({
  root: "front",
  base: "./",
  plugins: [preact(), neuPlugin()],

  server: {
    watch: {
      usePolling: true,
    },
  },
});
