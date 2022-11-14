import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import ContractInteract from "./ContractInteract";
import "./index.css";
import SourcesRegistry from "./SourcesRegistry";
import { SnackbarProvider } from "notistack";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <SnackbarProvider maxSnack={3}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/interact" element={<ContractInteract />} />
          <Route path="/sourcesRegistry" element={<SourcesRegistry />} />
          <Route path="/:contractAddress" element={<App />} />
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </SnackbarProvider>,
);
