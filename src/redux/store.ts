import { configureStore } from "@reduxjs/toolkit";
import tierDataReducer from './slice/tierDataSlice'

export const store = configureStore({
    reducer:{
        tierData:tierDataReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
