import { redirect } from "react-router-dom";
import { instanceAPI } from ".";

export const signUp = (username: string, email: string, password: string) => {
  return instanceAPI.post("registration", {
    username,
    email,
    password,
  });
};
export const signIn = (login: string, password: string) => {
  return instanceAPI
    .post("login", {
      login,
      password,
    })
    .then((response) => {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      return response.data;
    });
};
export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
};
instanceAPI.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await refreshToken();
          const { accessToken } = rs.data;
          localStorage.setItem("accessToken", accessToken);
          return instanceAPI(originalConfig);
        } catch (_error) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }

          return Promise.reject(_error);
        }
      }

      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      } 
    }

    return Promise.reject(err);
  }
);

export const refreshToken = async () => {
  try {
        return await instanceAPI.post("/refresh", {
            refreshToken: localStorage.getItem("refreshToken"),
        });
    } catch {
         window.location.href = '/auth/sign-in'
    }
};


// отображение для гостя или пользователя дать редактировать