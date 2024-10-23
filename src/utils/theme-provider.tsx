import { ThemeProvider } from "styled-components";
import { theme } from "antd";
import React from "react";
import { useAppSelector } from "../redux/hooks";

export default ({ children }: React.PropsWithChildren) => {
  const themeSC = useAppSelector((state) => state.theme.value);
  const { token } = theme.useToken();
  return (
    <ThemeProvider theme={{ antd: token, base: themeSC }}>
      {children}
    </ThemeProvider>
  );
};