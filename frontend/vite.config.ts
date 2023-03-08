/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), Pages()],
  test: {
    globals: true,
    environment: "jsdom",
    // Path to setup files. They will be run before each test file.
    setupFiles: "./src/__test__/vitest.setup.ts",
    // カバレッジ設定
    // https://vitest.dev/guide/coverage.html
    coverage: {
      provider: "c8",
      reporter: ["text", "json", "html"],
      // 出力するファイルを格納するディレクトリ
      reportsDirectory: "../doc/coverage/frontend",
    },
  },
});
