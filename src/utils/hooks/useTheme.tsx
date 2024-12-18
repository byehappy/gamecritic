import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { darkTheme, lightTheme } from "../../styles/theme";

interface ThemeContextProps {
  theme: typeof lightTheme;
  themeName: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("Контекст темы не найден");
  }
  return context;
};

export const ThemeProviderWrapper = ({ children }: React.PropsWithChildren) => {
  const [themeName, setThemeName] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") ||
      localStorage.setItem(
        "theme",
        window.matchMedia("(prefers-color-scheme:dark)").matches
          ? "dark"
          : "light"
      )
  );

  const toggleTheme = useCallback(() => {
    const newTheme = themeName === "light" ? "dark" : "light";
    setThemeName(newTheme);
    localStorage.setItem("theme", newTheme);
  }, [themeName]);

  const theme = useMemo(
    () => (themeName === "light" ? lightTheme : darkTheme),
    [themeName]
  );
  const ThemeProperties = useMemo(
    () => ({
      theme,
      themeName,
      toggleTheme,
    }),
    [theme, themeName, toggleTheme]
  );
  return (
    <ThemeContext.Provider value={ThemeProperties}>
      {children}
    </ThemeContext.Provider>
  );
};
