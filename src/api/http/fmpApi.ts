import axios, { InternalAxiosRequestConfig } from "axios";
import qs from "qs";

const fmpApi = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API}/api/v0/fmp/api/v3`,
});

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  config.paramsSerializer = {
    serialize: (params) => qs.stringify(params),
  };
  return config;
};

fmpApi.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error)
);

fmpApi.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default fmpApi;
