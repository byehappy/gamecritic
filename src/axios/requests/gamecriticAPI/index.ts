import axios from "axios";

export const instanceAPI = axios.create({
    baseURL: import.meta.env.VITE_URL_BACKEND,
  });