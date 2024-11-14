import { instanceAPI } from ".";
export const signUp = (username: string, email: string, password: string) => {
  return instanceAPI.post("registration", {
    username,
    email,
    password,
  });
};
export const signIn = async (login: string, password: string) => {
  return instanceAPI.post("login", {
    login,
    password,
  });
};
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const refreshToken = () => {
    return instanceAPI.post("/refresh", {
      refreshToken: localStorage.getItem("refreshToken"),
    });
};
