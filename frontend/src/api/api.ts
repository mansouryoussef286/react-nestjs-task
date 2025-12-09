import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import type { CurrentUser } from "../models/user.model";

class Api {
  axiosApi: AxiosInstance;
  constructor() {
    this.axiosApi = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: import.meta.env.VITE_API_TIMEOUT || 5000,
    });

    this.axiosApi.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    this.axiosApi.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status != 401 || originalRequest._retry)
          return Promise.reject(error);

        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers!["Authorization"] = `Bearer ${token}`;
                resolve(this.axiosApi(originalRequest));
              },
              reject: (err) => reject(err),
            });
          });
        }

        originalRequest._retry = true;
        this.isRefreshing = true;

        try {
          const currentUser = JSON.parse(
            localStorage.getItem("currentUser") || "{}"
          ) as CurrentUser;
          const refreshToken = localStorage.getItem("refreshToken");

          const body = {
            email: currentUser.email,
            refreshToken,
          };
          const refreshResponse: any = await this.Post(
            "/account/refresh",
            body
          );

          localStorage.setItem("accessToken", refreshResponse.accessToken);
          localStorage.setItem("refreshToken", refreshResponse.refreshToken);
          localStorage.setItem(
            "currentUser",
            JSON.stringify(refreshResponse.currentUser)
          );

          // Attach new token to original request
          originalRequest.headers![
            "Authorization"
          ] = `Bearer ${refreshResponse.accessToken}`;

          this.processQueue(null, refreshResponse.accessToken);
          return this.axiosApi(originalRequest);
        } catch (refreshErr) {
          this.processQueue(refreshErr, null);

          // Refresh failed → user must sign in again
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("currentUser");

          window.location.href = "/signin";
          return Promise.reject(refreshErr);
        } finally {
          this.isRefreshing = false;
        }
      }
    );
  }

  isRefreshing = false;
  failedQueue: {
    resolve: (token: string) => void;
    reject: (err: any) => void;
  }[] = [];

  processQueue = (error: any, token: string | null = null) => {
    this.failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token!);
    });
    this.failedQueue = [];
  };

  async Get<T>(url: string, params?: object): Promise<T | null> {
    const { data } = await this.axiosApi.get<T>(url, { params });
    return data;
  }

  async Post<T>(url: string, body?: object): Promise<T | null> {
    const { data } = await this.axiosApi.post<T>(url, body);
    return data;
  }
}

export const api = new Api();
