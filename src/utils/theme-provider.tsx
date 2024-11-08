import { ThemeProvider } from "styled-components";
import { theme } from "antd";
import React from "react";
import { darkTheme, lightTheme } from "../styles/theme";

export default ({ children }: React.PropsWithChildren) => {
  const themeSC = localStorage.getItem("theme")
  const { token } = theme.useToken();
  return (
    <ThemeProvider theme={{ antd: token, base: themeSC === "light" ? lightTheme : darkTheme }}>
      {children}
    </ThemeProvider>
  );
};