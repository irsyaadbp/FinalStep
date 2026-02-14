import { $fetch } from './$fetch';
import { type LoginInput, type RegisterInput, type AuthResponse, type ApiResponse, type UserData } from '@/types/shared';

export const authService = {
  login: (data: LoginInput) => {
    return $fetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: data,
    });
  },

  register: (data: RegisterInput) => {
    return $fetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: data,
    });
  },
  
  getMe: () => {
    return $fetch<ApiResponse<UserData>>('/api/auth/me');
  }
};

