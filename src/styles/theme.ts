import { DefaultTheme } from "styled-components";
import { ITheme, ThemeEnum } from "../interfaces/styled";

export const baseTheme:ITheme = {
  colors: {
    primary: "#7986cb",
    secondary: "#2b2b2b",
    success: "#4caf50",
    danger: "#f44336 ",
    bg: "",
    font: ""
  },
  margins:{
    min:"3rem",
    basic:"5rem",
    big:"10rem"
  }
};

export const lightTheme: DefaultTheme = {
    ...baseTheme,
    type: ThemeEnum.light,
  
    colors: {
      ...baseTheme.colors,
      bg: '#E5E4E8',
      font: '#2e2532',
    },
  }
  
  export const darkTheme: DefaultTheme = {
    ...baseTheme,
    type: ThemeEnum.dark,
  
    colors: {
      ...baseTheme.colors,
      bg: '#2e2532',
      font: '#E5E4E8',
    },
  }