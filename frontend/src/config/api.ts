import axios from 'axios';

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
};

const getHeaders = () => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userDateTime = new Date().toISOString();

  const headers: Record<string, string> = {
    'X-Timezone': tz,
    'X-User-DateTime': userDateTime,
  };

  return headers;
};

const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const customHeaders = getHeaders();

  Object.entries(customHeaders).forEach(([key, value]) => {
    config.headers.set(key, value);
  });

  return config;
});

export const apiClient = {
  get: async (url: string, options?: any) => {
    const response = await axiosInstance.get(url, options);

    return response.data;
  },

  post: async (url: string, data?: any, options?: any) => {
    const response = await axiosInstance.post(url, data, options);

    return response.data;
  },

  put: async (url: string, data?: any, options?: any) => {
    const response = await axiosInstance.put(url, data, options);

    return response.data;
  },

  delete: async (url: string, options?: any) => {
    const response = await axiosInstance.delete(url, options);

    return response.data;
  },
};
