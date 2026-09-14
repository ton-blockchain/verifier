import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ContractPage from "./pages/ContractPage";
import ContractInteract from "./components/admin/ContractInteract";
import "./index.css";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { Admin } from "./components/admin/Admin";
import { initGA } from "./lib/googleAnalytics";
import { TactDeployer } from "./components/tactDeployer/TactDeployer";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import HomePage from "./pages/HomePage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

initGA();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <SnackbarProvider maxSnack={3}>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <TonConnectUIProvider manifestUrl="https://verifier.ton.org/tonconnect-manifest.json">
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route path="/interact" element={<ContractInteract />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/tactDeployer/:ipfsHash" element={<TactDeployer />} />
              <Route path="/:contractAddress" element={<ContractPage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </TonConnectUIProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </SnackbarProvider>,
);
