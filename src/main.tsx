import "@mantine/core/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "./styles.css";
import App from "./App.tsx";
import { theme } from "./theme.ts";
// дата
import { DatesProvider } from "@mantine/dates";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "@mantine/dates/styles.css";

//security
import { OpenAPI } from "./api/generated/core/OpenAPI";
import { AuthProvider } from "./context/AuthContext.tsx";

const token = localStorage.getItem("auth_token");
if (token) {
  OpenAPI.TOKEN = token;
}
//security

dayjs.locale("ru");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <DatesProvider settings={{ locale: "ru" }}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </DatesProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>
);
