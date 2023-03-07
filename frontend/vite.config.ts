/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), Pages()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__test__/vitest.setup.ts",
  },
});
