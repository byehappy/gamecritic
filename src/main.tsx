import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { store } from "./redux/store.ts";
import { Provider } from "react-redux";
import { ToasterProvider } from "./utils/Toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ToasterProvider>
        <App />
      </ToasterProvider>
    </Provider>
  </StrictMode>
);
