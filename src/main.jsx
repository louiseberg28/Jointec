import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import AboutPage from "./pages/About";
import CasesPage from "./pages/Cases";
import Internal from "./pages/Internal";
import MachinePage from "./pages/Machine";
import NewsPage from "./pages/News";
import "./i18n";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/about" replace />} />
        <Route path="/home" element={<App />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/machines/:slug" element={<MachinePage />} />
        <Route path="/internal/*" element={<Internal />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
