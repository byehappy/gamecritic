import GlobalStyle from "./styles/global";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ConfigProvider } from "antd";
import ThemeProvider from "./utils/theme-provider";
import { useAppSelector } from "./redux/hooks";
import { useEffect } from "react";
import { ToasterList, useToaster } from "./utils/Toaster";
import { createPortal } from "react-dom";

function App() {
  const { addMessage, container, toasters,addLoading } = useToaster();
  const messages = useAppSelector((state) => state.message);
  const loadingReq = useAppSelector(state=>state.loading)
  useEffect(() => {
    if (messages.error) addMessage(messages.error, "error");
    if (messages.success) addMessage(messages.success, "success");
    if (messages.message) addMessage(messages.message, "info");
  }, [addMessage, messages]);
  useEffect(()=>{
    addLoading(loadingReq)
  },[addLoading, loadingReq])
  localStorage.setItem("theme", "light");
  return (
    <ConfigProvider>
      <ThemeProvider>
        <RouterProvider router={router} fallbackElement={<p>Загрузка...</p>} />
        <GlobalStyle />
        {container &&
          createPortal(<ToasterList toasters={toasters} />, container)}
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
