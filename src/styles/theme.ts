import { ITheme, ThemeEnum } from "../interfaces/styled";

export const baseTheme: ITheme = {
  colors: {
    primary: "#AB5EF1",
    success: "green",
    danger: "red",
    bg: "",
    font: "",
    altFont: "",
    backgroundLoading: "",
    links: {
      color: "",
      secondaryColor: "",
    },
  },
  margins: {
    min: "3rem",
    basic: "5rem",
    big: "10rem",
  },
  borderRadius: {
    min: "0.25em",
    basic: "1em",
    large: "2em",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "2rem",
  },
  fonts: {
    logo: "Silkscreen",
    basic: "Raleway",
  },
  fontSizes: {
    small: "0.8rem",
    normal: "1rem",
    large: "1.5rem",
    adaptivH1: "calc(18px + 10 * (100vw / 1280))",
    adaptivText: "calc(16px + 12 * (100vw / 1280))",
    adaptivSmallText: "calc(12px + 4 * (100vw / 1280))",
    adaptivLogo: "calc(20px + 28 * (100vw / 1280))",
  },
  gradient: {
    loading: "",
  },
  image: {
    no_image: "",
  },
};
export type StyledTheme = ITheme & {
  type: ThemeEnum;
};
export const lightTheme: StyledTheme = {
  ...baseTheme,
  type: ThemeEnum.light,

  colors: {
    ...baseTheme.colors,
    bg: "#fbfbfb",
    font: "#000",
    altFont: "white",
    backgroundLoading: "white",
    links: {
      color: "hsl(237,50%,45%)",
      secondaryColor: "hsl(237,55%,57%)",
    },
  },
  gradient: {
    loading: "linear-gradient(to right, #f6f6f6 8%, #f0f0f0 18%, #f6f6f6 33%)",
  },
  image: {
    no_image: `/assets/icons/noImage/black_no_image.svg`,
  },
};

export const darkTheme: StyledTheme = {
  ...baseTheme,
  type: ThemeEnum.dark,

  colors: {
    ...baseTheme.colors,
    bg: "#242223",
    font: "#fbfbfb",
    altFont: "black",
    backgroundLoading: "black",
    links: {
      color: "hsl(237,50%,60%)",
      secondaryColor: "hsl(237,55%,70%)",
    },
  },
  gradient: {
    loading: "linear-gradient(to right, #4d494b 8%, #353537 18%, #4d494b 33%)",
  },
  image: {
    no_image: `/assets/icons/noImage/white_no_image.svg`,
  },
};
