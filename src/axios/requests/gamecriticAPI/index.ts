import axios, { InternalAxiosRequestConfig } from "axios";

export const instanceAPI = axios.create({
    baseURL: import.meta.env.VITE_URL_BACKEND,
  });
// const activeRequests = new Map<string, AbortController>();

// const generateRequestKey = (config: InternalAxiosRequestConfig<unknown>) => {
//   const { method, url, params, data } = config;
//   return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
// };


// instanceAPI.interceptors.request.use((config) => {
//   const requestKey = generateRequestKey(config);

//   if (activeRequests.has(requestKey)) {
//     const controller = activeRequests.get(requestKey);
//     controller?.abort();
//     activeRequests.delete(requestKey);
//   }

//   const controller = new AbortController();
//   config.signal = controller.signal;

//   activeRequests.set(requestKey, controller);

//   return config;
// });

// instanceAPI.interceptors.response.use(
//   (response) => {
//     const requestKey = generateRequestKey(response.config);
//     activeRequests.delete(requestKey);
//     return response;
//   },
//   (error) => {
//     const requestKey = generateRequestKey(error.config);
//     activeRequests.delete(requestKey);

//     return Promise.reject(error);
//   }
// );

// export default instanceAPI;