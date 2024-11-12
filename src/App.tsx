
import GlobalStyle from "./styles/global";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ConfigProvider,message } from "antd";
import ThemeProvider from "./utils/theme-provider";
import { useAppSelector } from "./redux/hooks";
import { useEffect } from "react";

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const messages = useAppSelector((state) => state.message);
  useEffect(()=>{
    if(messages.error) messageApi.open({type:"error",content:messages.error})
    if(messages.message) messageApi.open({type:"info",content:messages.message})
  },[messageApi, messages])
  localStorage.setItem("theme","light")
  return (
    <ConfigProvider>
      <ThemeProvider>
      {contextHolder}
        <RouterProvider router={router} fallbackElement={<p>Загрузка...</p>} />
        <GlobalStyle />
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
