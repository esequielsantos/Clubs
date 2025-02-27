import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { I18nextProvider } from "react-i18next";
import i18n from './i18n';
import ClubsRoutes from '@/routes';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
            <ClubsRoutes />
        </I18nextProvider>
      </QueryClientProvider>
    </PrimeReactProvider>
  </React.StrictMode>,
);
