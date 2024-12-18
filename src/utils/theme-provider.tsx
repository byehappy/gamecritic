import { ThemeProvider } from "styled-components";
import { theme as AntTheme, ConfigProvider } from "antd";
import React from "react";
import { useTheme } from "./hooks/useTheme";

// eslint-disable-next-line react-refresh/only-export-components
export default ({ children }: React.PropsWithChildren) => {
  const { theme, themeName } = useTheme();
  const { token } = AntTheme.useToken();

  return(
    <ThemeProvider theme={{
      antd:token,
      ...theme
    }}>
      <ConfigProvider
        theme={{
          algorithm:
            themeName === "light"
              ? AntTheme.defaultAlgorithm
              : AntTheme.darkAlgorithm,
          components: {
            Button: {
              colorBgContainer: "transparent",
            },
          },
          token: {
            colorPrimaryHover: theme.colors.secondary,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeProvider>
  );
};
