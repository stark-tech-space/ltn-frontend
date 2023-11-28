import axios, { InternalAxiosRequestConfig } from "axios";
import qs from "qs";

const request = axios.create({
  baseURL: `https://financialmodelingprep.com/api/v3`,
});

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  config.params = {
    ...config.params,
    apikey: "72ad205a252b018be6cb9048dddfd69f",
  };
  config.paramsSerializer = {
    serialize: (params) => qs.stringify(params),
  };
  return config;
};

request.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default request;
