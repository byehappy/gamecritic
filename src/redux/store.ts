import { configureStore } from "@reduxjs/toolkit";
import tierDataReducer from './slice/tierDataSlice'
import authReducer from './slice/authSlice'
export const store = configureStore({
    reducer:{
        tierData:tierDataReducer,
        auth:authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
