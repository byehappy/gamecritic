import { configureStore } from "@reduxjs/toolkit";
import tierDataReducer from './slice/tierDataSlice'
import authReducer from './slice/authSlice'
import messageReducer  from "./slice/messageSlice"
export const store = configureStore({
    reducer:{
        tierData:tierDataReducer,
        auth:authReducer,
        message:messageReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
