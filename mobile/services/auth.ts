import { $fetch } from '../lib/$fetch';
import { AuthResponse, LoginInput, RegisterInput, UserData, ApiResponse } from '../lib/types';

export const authService = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    return $fetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: data,
    });
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    return $fetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: data,
    });
  },

  getMe: async (): Promise<ApiResponse<UserData>> => {
    return $fetch<ApiResponse<UserData>>('/api/auth/me');
  },
};
