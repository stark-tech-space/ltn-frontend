import axios, { InternalAxiosRequestConfig } from "axios";
import qs from "qs";

const ltnApi = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API}/api/v0`,
});

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  config.paramsSerializer = {
    serialize: (params) => qs.stringify(params),
  };
  return config;
};

ltnApi.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error)
);

ltnApi.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default ltnApi;
