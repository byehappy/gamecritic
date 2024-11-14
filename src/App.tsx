import GlobalStyle from "./styles/global";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ConfigProvider, message } from "antd";
import ThemeProvider from "./utils/theme-provider";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { useCallback, useEffect } from "react";
import { updateUserRows } from "./axios";
import { setMessage } from "./redux/slice/messageSlice";

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const messages = useAppSelector((state) => state.message);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const saveSession = useCallback(async () => {
    if (currentUser) {
      try {
        for (const key in sessionStorage) {
          const data = sessionStorage.getItem(key);
          if (data) {
            await updateUserRows(currentUser.id, key, data);
            sessionStorage.removeItem(key);
          }
        }
      } catch (error) {
        dispatch(setMessage({ error: "Ошибка при сохранении:" + error }));
      }
    }
  }, [currentUser, dispatch]);
  useEffect(() => {
    saveSession();
  }, [saveSession]);
  useEffect(() => {
    if (messages.error)
      messageApi.open({ type: "error", content: messages.error });
    if (messages.message)
      messageApi.open({ type: "info", content: messages.message });
  }, [messageApi, messages]);
  localStorage.setItem("theme", "light");
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
