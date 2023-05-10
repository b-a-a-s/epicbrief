import Axios, { AxiosResponse } from 'axios';

const MEETINGS_API_BASE_URL = 'https://us-central1-epicbrief-c47c8.cloudfunctions.net';
// const MEETINGS_API_BASE_URL = 'http://127.0.0.1:5001/epicbrief-c47c8/us-central1';

Axios.interceptors.request.use(
  (config) => {
    config.baseURL = MEETINGS_API_BASE_URL;
    return config;
  },
  (error) => Promise.reject(error)
);

Axios.interceptors.response.use((response: AxiosResponse) => {
  return response.data;
});
