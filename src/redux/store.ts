import { configureStore } from "@reduxjs/toolkit";
import tierDataReducer from './slice/tierDataSlice'
import authReducer from './slice/authSlice'
import messageReducer  from "./slice/messageSlice"
import createTemplateReducer  from "./slice/createTemplateSlice"
import loadingReducer from './slice/loadingSlice'
export const store = configureStore({
    reducer:{
        message:messageReducer,
        tierData:tierDataReducer,
        auth:authReducer,
        createTemplate:createTemplateReducer,
        loading:loadingReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
