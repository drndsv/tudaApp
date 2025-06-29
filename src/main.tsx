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

dayjs.locale("ru");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <DatesProvider settings={{ locale: "ru" }}>
          <App />
        </DatesProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>
);
