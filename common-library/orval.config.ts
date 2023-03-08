import { defineConfig } from "orval";

export default defineConfig({
  restapi: {
    input: {
      // validation: true,
      target: "./openapi/openapi.yml",
    },
    output: {
      mode: "single",
      workspace: "src/",
      target: "rest/api.ts",
      // mock: true,
      clean: true,
    },
  },
});
