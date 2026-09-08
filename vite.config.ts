import { federation } from "@module-federation/vite"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "template",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
      },

      dts: false,
      shared: {
        react: { singleton: true },
        "react/": { singleton: true },
        "react-dom": { singleton: true },
        "react-dom/": { singleton: true },
        "react-router": { singleton: true },
        i18next: { singleton: true },
        "react-i18next": { singleton: true },
        "@tanstack/react-query": { singleton: true },
      },
    }),
  ],
  base: "/v2/remote/template/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    modulePreload: false,
    target: "chrome89",
    minify: false,
    cssCodeSplit: true,
  },
})
