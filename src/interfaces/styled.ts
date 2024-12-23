export enum ThemeEnum {
  light = "light",
  dark = "dark",
}

export interface ITheme {
  colors: {
    primary: string;
    success: string;
    danger: string;
    bg: string;
    font: string;
    altFont: string;
    backgroundLoading: string;
    links: {
      color: string;
      secondaryColor: string;
    };
  };
  margins: {
    min: string;
    basic: string;
    big: string;
  };
  borderRadius: {
    min: string;
    basic: string;
    large: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  };
  fonts: {
    logo: string;
    basic: string;
  };
  fontSizes: {
    small: string;
    normal: string;
    large: string;
    adaptivH1: string;
    adaptivText: string;
    adaptivSmallText: string;
    adaptivLogo: string;
  };
  gradient:{
    loading:string;
  }
  image:{
    no_image:string;
  }
}
