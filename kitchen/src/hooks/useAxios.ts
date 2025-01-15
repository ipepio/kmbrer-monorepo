import axios, { AxiosInstance } from "axios";
import { useEffect, useCallback } from "react";
import { API_URL } from "@/config/config";

const instance: AxiosInstance = axios.create({
  baseURL: API_URL,
});

const useAxios = (): AxiosInstance => {
  const createAxiosInstance = useCallback(() => {
    instance.interceptors.request.use(
      (config) => {
        let token: string | null = null;
        const userData = localStorage.getItem("userData");
        if (userData) {
          token = JSON.parse(userData).token || null;
        }
        if (!token) {
          const pendingSession = localStorage.getItem("pendingSession");
          if (pendingSession) {
            token = JSON.parse(pendingSession).token || null;
          }
        }
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, []);

  useEffect(() => {
    createAxiosInstance();
  }, [createAxiosInstance]);

  return instance;
};

export default useAxios;
