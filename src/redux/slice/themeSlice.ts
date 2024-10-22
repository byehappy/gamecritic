import { createSlice } from "@reduxjs/toolkit";
import { DefaultTheme } from "styled-components/dist/types";
import { darkTheme, lightTheme } from "../../styles/theme";
import { ThemeEnum } from "../../interfaces/styled";

type TypeState  = {
    value: DefaultTheme
}

const initialState:TypeState = {
    value:lightTheme
}

export const themeSlice = createSlice({
    name:"theme",
    initialState,
    reducers:{
        switchTheme(state){
            state.value = state.value.type === ThemeEnum.light ? darkTheme : lightTheme
        }
    }
})

export const {switchTheme} = themeSlice.actions
export default themeSlice.reducer
