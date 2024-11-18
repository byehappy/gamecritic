import GlobalStyle from "./styles/global";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ConfigProvider } from "antd";
import ThemeProvider from "./utils/theme-provider";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { useCallback, useEffect } from "react";
import { updateUserRows } from "./axios";
import { setMessage } from "./redux/slice/messageSlice";
import { ToasterList, useToaster } from "./utils/Toaster";
import { createPortal } from "react-dom";

function App() {
  const { addMessage, container, toasters } = useToaster();
  const messages = useAppSelector((state) => state.message);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const saveSession = useCallback(async () => {
    if (currentUser) {
      try {
        for (const key in sessionStorage) {
          if (key.includes("save-")) {
            const data = sessionStorage.getItem(key);
            if (data) {
              const strKey = RegExp(/\d+/).exec(key);
              const numKey = strKey ? parseInt(strKey[0]) : null;
              if (numKey) {
                await updateUserRows(currentUser.id, numKey, data);
                sessionStorage.removeItem(key);
                dispatch(
                  setMessage({ success: "Последние изменения сохранены" })
                );
              }
            }
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
    if (messages.error) addMessage(messages.error, "error");
    if (messages.success) addMessage(messages.success, "success");
    if (messages.message) addMessage(messages.message, "info");
  }, [addMessage, messages]);
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
