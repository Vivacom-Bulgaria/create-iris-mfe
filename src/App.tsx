import "./i18n"
// The exposed module must pull the stylesheet itself. main.tsx only runs
// standalone, so when the host imports ./App nothing else would load the CSS.
import "./index.css"

import { Navigate, Route, Routes } from "react-router"

import { Toaster } from "@/components/ui/toast"
import HomePage from "@/pages/home"

import { ThemeProvider } from "./components/theme-provider"

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}
