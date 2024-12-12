import GlobalStyle from "./styles/global";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ConfigProvider } from "antd";
import ThemeProvider from "./utils/theme-provider";
import { useAppSelector } from "./redux/hooks";
import { useEffect, useState } from "react";
import { useToaster } from "./utils/hooks/useToaster";
import { LoadingGameCritic } from "./utils/LoadingSvgGame";

function App() {
  const { addMessage } = useToaster();
  const messages = useAppSelector((state) => state.message);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 4000);
  }, []);

  useEffect(() => {
    if (messages.error) addMessage(messages.error, "error");
    if (messages.success) addMessage(messages.success, "success");
    if (messages.message) addMessage(messages.message, "info");
  }, [addMessage, messages]);
  localStorage.setItem("theme", "light");
  return (
    <ConfigProvider>
      <ThemeProvider>
        {loading && <LoadingGameCritic />}
        <RouterProvider router={router} fallbackElement={<p>Загрузка...</p>} />
        <GlobalStyle />
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
