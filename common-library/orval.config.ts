import { defineConfig } from "orval";

export default defineConfig({
  restapi: {
    input: {
      target: "./openapi/openapi.yml",
    },
    output: {
      mode: "split",
      target: "./src/rest/api.ts",
      schemas: "./src/rest/model",
      client: "react-query",
      mock: true,
      clean: true,
    },
  },
});
