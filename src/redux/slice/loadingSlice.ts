import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState:Array<string> = [];

const messageSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    addLoading: (state, action:PayloadAction<string>) => {
      if(!state.includes(action.payload)){
        state.push(action.payload)
      }
      return state
    },
    delLoading: (state,action) => {
      return state.filter((e) => e !== action.payload)
    },
    clearLoading: () => {
        return initialState;
      },
  },
});

const { reducer, actions } = messageSlice;

export const { addLoading,delLoading, clearLoading } = actions
export default reducer;