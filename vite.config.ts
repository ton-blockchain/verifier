import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/verifier/",
  build: {
    // sourcemap: true,
    target: ["es2020"],
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
});
