import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

let getAccessToken: (() => string | null) | null = null;
let refreshAccessToken: (() => Promise<string | null>) | null = null;

export const setAccessTokenProvider = (provider: () => string | null): void => {
  getAccessToken = provider;
};

export const setRefreshHandler = (handler: () => Promise<string | null>): void => {
  refreshAccessToken = handler;
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status as number | undefined;
    const originalRequest = error?.config as RetriableRequestConfig | undefined;

    if (status === 401 && originalRequest && !originalRequest._retry && refreshAccessToken) {
      originalRequest._retry = true;
      const token = await refreshAccessToken();
      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      }
    }

    throw error;
  }
);
