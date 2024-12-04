import { AxiosError } from "axios";
import { AppDispatch } from "../../../redux/store";
import { addLoading, delLoading } from "../../../redux/slice/loadingSlice";
import { instanceAPI } from ".";

export const setupLoadingIntercepotrs = (dispatch: AppDispatch) => {
  instanceAPI.interceptors.request.use(
    (config) => {
      const saveConfig =
        config.baseURL! + config.url + config.method;
      dispatch(addLoading(JSON.stringify(saveConfig)));
      return config;
    },
    (err) => Promise.reject(err)
  );
  instanceAPI.interceptors.response.use(
    (res) => {
      const config = res.config;
      const saveConfig =
        config.baseURL! + config.url + config.method;
      dispatch(delLoading(JSON.stringify(saveConfig)));
      return res;
    },
    async (err) => {
      const _error = err as AxiosError;
      const config = _error.config;
      if (config) {
        const saveConfig =
          config.baseURL! + config.url + config.method;
        dispatch(delLoading(JSON.stringify(saveConfig)));
      }

      return Promise.reject(_error);
    }
  );
};
