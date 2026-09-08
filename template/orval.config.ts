import { defineConfig } from "orval"

export default defineConfig({
  templateWs: {
    input: {
      target: "http://localhost:5006/template-ws/swagger/v1/swagger.json",
    },
    output: {
      mode: "tags-split",
      target: "./src/data/template-ws/endpoints",
      schemas: "./src/data/template-ws/model",
      client: "react-query",
      baseUrl: "/template-ws",
      httpClient: "axios",
      formatter: "prettier",
      clean: true,
      override: {
        mutator: {
          path: "./src/lib/api.ts",
          name: "apiMutator",
        },
      },
    },
  },
})
