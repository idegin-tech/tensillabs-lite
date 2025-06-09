import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { addToast } from '@heroui/react';

import { apiClient } from '../config/api';
import { User } from '../types/auth.types';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  timezone: string;
}

interface VerifyEmailData {
  email: string;
  otp: string;
}

interface ResendOtpData {
  email: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      return await apiClient.post('/auth/login', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'refresh'] });
      window.location.reload();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Login failed';

      addToast({
        title: 'Login Failed',
        description: message,
        color: 'danger',
        timeout: 5000,
      });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData): Promise<AuthResponse> => {
      return await apiClient.post('/auth/register', data);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Registration failed';

      addToast({
        title: 'Registration Failed',
        description: message,
        color: 'danger',
        timeout: 5000,
      });
    },
  });
};

export const useVerifyEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: VerifyEmailData): Promise<AuthResponse> => {
      return await apiClient.post('/auth/verify-email', data);
    },
    onSuccess: () => {
      addToast({
        title: 'Email Verified!',
        description:
          'Your email has been successfully verified. Redirecting...',
        color: 'success',
        timeout: 4000,
      });

      setTimeout(() => {
        navigate('/');
      }, 4000);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Email verification failed';

      addToast({
        title: 'Verification Failed',
        description: message,
        color: 'danger',
        timeout: 5000,
      });
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: async (data: ResendOtpData): Promise<AuthResponse> => {
      return await apiClient.post('/auth/resend-otp', data);
    },
    onSuccess: () => {
      addToast({
        title: 'OTP Sent',
        description: 'A new OTP has been sent to your email.',
        color: 'success',
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to resend OTP';

      addToast({
        title: 'Failed',
        description: message,
        color: 'danger',
        timeout: 5000,
      });
    },
  });
};

export const useRefreshToken = () => {
  return useQuery({
    queryKey: ['auth', 'refresh'],
    queryFn: async (): Promise<User | null> => {
      try {
        const response = await apiClient.post('/auth/refresh-token');
        return response?.payload.user || null;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};
