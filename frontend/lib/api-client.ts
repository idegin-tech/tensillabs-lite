import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { APP_CONFIG } from '@/config/app.config'

export class ApiError extends Error {
  status: number
  data?: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

class ApiClient {
  private axiosInstance: AxiosInstance
  private requestId = 0

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: APP_CONFIG.apiUrl,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.axiosInstance.interceptors.request.use(
      (config) => {
        config.headers['X-Request-ID'] = (++this.requestId).toString()
        return config
      },
      (error) => Promise.reject(error)
    )

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response) {
          const apiError = new ApiError(
            error.response.data?.message || `HTTP error! status: ${error.response.status}`,
            error.response.status,
            error.response.data
          )
          return Promise.reject(apiError)
        } else if (error.request) {
          const apiError = new ApiError('Network error', 0, error.request)
          return Promise.reject(apiError)
        } else {
          const apiError = new ApiError('Request setup error', 0, error.message)
          return Promise.reject(apiError)
        }
      }
    )
  }

  async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint, config)
    return response.data
  }

  async post<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data, config)
    return response.data
  }

  async put<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data, config)
    return response.data
  }

  async patch<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, data, config)
    return response.data
  }

  async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint, config)
    return response.data
  }
}

export const api = new ApiClient()
