import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { LedgerProvider } from "./state/ledger";
import "./styles/theme.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <LedgerProvider>
        <App />
      </LedgerProvider>
    </HashRouter>
  </StrictMode>,
);
