import { useParams } from 'react-router-dom';
import { apiClient } from '../config/api';

export function useApi() {
  const params = useParams();
  const memberId = params.member_id;

  const api = {
    get: async (url: string, options?: any) => {
      return apiClient.get(url, { 
        ...options,
        headers: {
          ...options?.headers,
          ...(memberId && { 'X-Member-ID': memberId })
        }
      });
    },

    post: async (url: string, data?: any, options?: any) => {
      return apiClient.post(url, data, {
        ...options,
        headers: {
          ...options?.headers,
          ...(memberId && { 'X-Member-ID': memberId })
        }
      });
    },

    put: async (url: string, data?: any, options?: any) => {
      return apiClient.put(url, data, {
        ...options,
        headers: {
          ...options?.headers,
          ...(memberId && { 'X-Member-ID': memberId })
        }
      });
    },

    delete: async (url: string, options?: any) => {
      return apiClient.delete(url, {
        ...options,
        headers: {
          ...options?.headers,
          ...(memberId && { 'X-Member-ID': memberId })
        }
      });
    },
  };

  return api;
}
