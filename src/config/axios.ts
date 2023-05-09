import Axios, { AxiosResponse } from 'axios';

Axios.interceptors.request.use(
  (config) => {
    config.baseURL = process.env.REACT_APP_MEETINGS_API_BASE_URL;
    return config;
  },
  (error) => Promise.reject(error)
);

Axios.interceptors.response.use((response: AxiosResponse) => {
  return response.data;
});
