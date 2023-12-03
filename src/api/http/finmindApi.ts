import axios, { InternalAxiosRequestConfig } from "axios";
import qs from "qs";

const finMindApi = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API}/api/v0/`,
});

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  config.paramsSerializer = {
    serialize: (params) => qs.stringify(params),
  };
  return config;
};

finMindApi.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error)
);

finMindApi.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default finMindApi;
