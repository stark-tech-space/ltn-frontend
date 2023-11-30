import axios, { InternalAxiosRequestConfig } from "axios";
import { FIN_MAIN_TOKEN } from "constant";
import qs from "qs";

const http = axios.create({
  baseURL: `https://api.finmindtrade.com/api/v4`,
});

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  config.params = {
    ...config.params,
    token: FIN_MAIN_TOKEN,
  };
  config.paramsSerializer = {
    serialize: (params) => qs.stringify(params),
  };
  return config;
};

http.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error)
);

http.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default http;
