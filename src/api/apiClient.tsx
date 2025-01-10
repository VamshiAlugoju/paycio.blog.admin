import { isAxiosError } from "axios";
 
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
 import { API_URL } from "./urls";

 
import { useState } from "react";

export const getToken = () => {
  const token = localStorage.getItem("accessToken");
  return token;
};

export const useToken = () => {
  const [token, setToken] = useState(getToken());
  
  return { token, setToken };
};

export const getBearerToken = () => {
  const token = "token"
  if (!token) return null;
  return `Bearer ${token}`;
};



export const axiosErrorHandler = (error: any) => {
  console.error(error);
  if (isAxiosError(error)) {
    return {
      status: false,
      message: "Something went wrong",
      ...error?.response?.data,
    };
  } else {
    return {
      status: false,
      message: "something broke!",
    };
  }
};

class AxiosClient {
  private httpClient: AxiosInstance;

  /**
   * CONSTRUCTOR ===========
   * Creates an instance of the API client.
   * @param baseUrl the base URL of the API
   */
  constructor(baseUrl: string) {
    this.httpClient = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: "application/json", // Default Accept header
        Authorization: getBearerToken(),
      },
    });
    this.httpClient.interceptors.response.use(
      (response) => response,
      (error) => {
        const errData = axiosErrorHandler(error);
        return Promise.reject(errData);
      }
    );
  }

  async request(url: string, options: AxiosRequestConfig = {}) {
    try {
      const res = await this.httpClient.request({ url, ...options });
      return res.data;
    } catch (error:any) {
      return {
        ...error,
      };
    }
  }

  async get(url: LinkString, options?: AxiosRequestConfig) {
    return this.request(url, { method: "GET", ...options });
  }

  async post(url: LinkString, data: any, options?: AxiosRequestConfig) {
    return this.request(url, { method: "POST", data, ...options });
  }

  async put(url: LinkString, data: any, options?: AxiosRequestConfig) {
    return this.request(url, { method: "PUT", data, ...options });
  }

  async delete(url: LinkString, options?: AxiosRequestConfig) {
    return this.request(url, { method: "DELETE", ...options });
  }
}

const apiClient = new AxiosClient( API_URL );
export default apiClient;

export type LinkString = string



