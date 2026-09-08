// Standalone dev entry point ONLY. When this package is loaded as a federated remote the host
// imports ./App directly and nothing in this file runs.

import "./index.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"

import { QueryProvider } from "@/providers/query-provider"

import App from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/v2/remote/template">
      <QueryProvider>
        <App />
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
)
