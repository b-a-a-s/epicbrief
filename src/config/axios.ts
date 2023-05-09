import Axios, { AxiosResponse } from 'axios';

const REACT_APP_MEETINGS_API_BASE_URL = 'https://us-central1-epicbrief-c47c8.cloudfunctions.net';

Axios.interceptors.request.use(
  (config) => {
    config.baseURL = REACT_APP_MEETINGS_API_BASE_URL;
    return config;
  },
  (error) => Promise.reject(error)
);

Axios.interceptors.response.use((response: AxiosResponse) => {
  return response.data;
});
