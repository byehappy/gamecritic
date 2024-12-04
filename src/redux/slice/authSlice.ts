import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  signIn,
  signUp,
  logout as logoutUser,
  refreshToken,
} from "../../axios";
import { AxiosError } from "axios";
import { setMessage } from "./messageSlice";

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
  async ({ username, email, password }: RegisterType, thunkAPI) => {
    try {
      const response = await signUp(username, email, password);
      return response;
    } catch (e) {
      const error = e as AxiosError;
      const message = error.response?.data as ErrorAuth;
      message.error.map((error) => {
        thunkAPI.dispatch(setMessage({ error: error.msg }));
      });
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export type ErrorAuth = {
  error: [
    {
      type: string;
      msg: string;
      path: string;
      locataion: string;
    }
  ];
};

export const login = createAsyncThunk(
  "auth/sign-in",
  async ({ username, password }: LoginType, thunkAPI) => {
    try {
      const response = await signIn(username, password);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      return { user: response.data.user };
    } catch (e) {
      const error = e as AxiosError;
      const message = error.response?.data as ErrorAuth;
      message.error.map((error) => {
        thunkAPI.dispatch(setMessage({ error: error.msg }));
      });
      return thunkAPI.rejectWithValue(error.response?.data);
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
    icon: string;
  } | null;
};
let user;
if (localStorage.getItem("refreshToken")) {
  const rs = await refreshToken();
  const { accessToken } = rs.data;
  localStorage.setItem("accessToken", accessToken);
  user = rs.data.user;
}

const initialState: InitialType = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setImageIcon(state, action) {
      if (state.user) {
        state.user.icon = action.payload;
      }
    },
  },
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
const { reducer, actions } = authSlice;
export const { setImageIcon } = actions;
export default reducer;
