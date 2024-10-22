import { useAppSelector } from "./redux/hooks";
import GlobalStyle from "./styles/global";
import { ThemeProvider } from "styled-components";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";


function App() {
  const theme = useAppSelector((state) => state.theme.value);
  return (
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} fallbackElement={<p>Загрузка...</p>} />
        <GlobalStyle />
      </ThemeProvider>
  );
}

export default App;
