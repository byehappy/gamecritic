import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { store } from "./redux/store.ts";
import { Provider } from "react-redux";
import { ToasterProvider } from "./utils/Toaster.tsx";
import { ThemeProviderWrapper } from "./utils/hooks/useTheme.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProviderWrapper>
        <ToasterProvider>
          <App />
        </ToasterProvider>
      </ThemeProviderWrapper>
    </Provider>
  </StrictMode>
);
