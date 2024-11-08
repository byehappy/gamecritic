import { configureStore } from "@reduxjs/toolkit";
import tierDataReducer from './slice/tierDataSlice'
import userReducer from './slice/userSlice'
export const store = configureStore({
    reducer:{
        tierData:tierDataReducer,
        user:userReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
