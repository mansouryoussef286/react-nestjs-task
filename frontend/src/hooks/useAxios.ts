import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { useContext, useEffect, useMemo, useRef } from "react";
import { UserServiceContext } from "../providers/userService.provider";
import { useNavigate } from "react-router-dom";
export type UserAPIHook = ReturnType<typeof useAxios>;

export const useAxios = () => {
  const navigate = useNavigate();

  let contextValues = useContext(UserServiceContext)!;
  let axiosApi: AxiosInstance;
  let isRefreshing: boolean = false;

  const contextRef = useRef(contextValues);
  useEffect(() => {
    contextRef.current = contextValues;
  }, [contextValues]);

  let failedQueue: {
    resolve: (token: string) => void;
    reject: (err: any) => void;
  }[] = [];

  let processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token!);
    });
    failedQueue = [];
  };

  axiosApi = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: import.meta.env.VITE_API_TIMEOUT || 5000,
    });
  }, []);

  useEffect(() => {
    console.log("register interceptors");

    axiosApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = contextRef.current.accessToken;
      console.log(token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axiosApi.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const { user, refreshToken, onSignin, onSignout } = contextRef.current;
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };
        // await new Promise(resolve => setTimeout(resolve, 5000));

        if (error.response?.status != 401 || originalRequest._retry)
          return Promise.reject(error);

        if (isRefreshing) {
          // If refresh is already happening → queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers!["Authorization"] = `Bearer ${token}`;
                resolve(axiosApi(originalRequest));
              },
              reject: (err) => reject(err),
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const body = {
            email: user?.email,
            refreshToken,
          };
          const refreshResponse: any = await axiosApi.post(
            "/account/refresh",
            body
          );
          onSignin(refreshResponse);

          // Attach new token to original request
          originalRequest.headers![
            "Authorization"
          ] = `Bearer ${refreshResponse.accessToken}`;

          processQueue(null, refreshResponse.accessToken);
          return axiosApi(originalRequest);
        } catch (refreshErr) {
          debugger;
          processQueue(refreshErr, null);

          // Refresh failed → user must sign in again
          onSignout();
          navigate("/signin");
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }
    );
  }, []);
  return {
    api: axiosApi,
  };
};
