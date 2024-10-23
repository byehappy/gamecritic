export enum ThemeEnum {
  light = "light",
  dark = "dark",
}

export interface ITheme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    danger: string;

    bg: string;
    font: string;
  };
  margins: {
    min: string;
    basic: string;
    big: string;
  };
}
