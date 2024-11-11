import axios from "axios";
axios.defaults.withCredentials = true;
const instanceAPI = axios.create({
  baseURL: import.meta.env.VITE_URL_BACKEND,
});
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
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
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
