import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { AppProviders } from "./app/providers";

async function enableMocking() {
  const useMswEnv = import.meta.env.VITE_USE_MSW as string | undefined;
  const useMsw = useMswEnv ? useMswEnv === "true" : import.meta.env.DEV;
  if (!useMsw) return;
  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </React.StrictMode>,
  );
});
