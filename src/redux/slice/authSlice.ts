import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signIn, signUp, logout as logoutUser } from "../../axios";

const local = localStorage.getItem("user");
const user = local && JSON.parse(local);
type RegisterType = {
  username: string;
  email: string;
  password: string;
};
type LoginType = {
  username: string;
  password: string;
};
export const register = createAsyncThunk(
  "auth/sign-up",
  async ({ username, email, password }: RegisterType) => {
    try {
      const response = await signUp(username, email, password);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const login = createAsyncThunk(
  "auth/sign-in",
  async ({ username, password }: LoginType) => {
    try {
      const data = await signIn(username, password);
      return { user: data.user };
    } catch (error) {
      console.error(error);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", () => {
  logoutUser();
});

type InitialType = {
  isLoggedIn: boolean;
  user: {
    username: string;
    id: string;
  } | null;
};

const initialState: InitialType = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(register.rejected, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload?.user;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

const { reducer } = authSlice;
export default reducer;
