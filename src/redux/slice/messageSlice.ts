import { createSlice } from "@reduxjs/toolkit";

type MessageType = {
    error?:string;
    message?:string;
}

const initialState:MessageType = {};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (_, action) => {
      return action.payload;
    },
    clearMessage: () => {
      return { message: "" };
    },
    clearError: () => {
        return { error: "" };
      },
  },
});

const { reducer, actions } = messageSlice;

export const { setMessage, clearMessage } = actions
export default reducer;