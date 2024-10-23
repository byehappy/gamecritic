
import GlobalStyle from "./styles/global";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ConfigProvider } from "antd";
import ThemeProvider from "./utils/theme-provider";

function App() {
  return (
    <ConfigProvider>
      <ThemeProvider>
        <RouterProvider router={router} fallbackElement={<p>Загрузка...</p>} />
        <GlobalStyle />
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
