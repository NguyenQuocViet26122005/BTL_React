import api from './api';
import type { LoginRequest, RegisterRequest, NguoiDung, NguoiDungBackend, ApiResponse } from '../types/index';

export const authService = {
  login: async (data: LoginRequest) => {
    console.log('Sending login request with data:', data);
    const response = await api.post<ApiResponse<{ token: string; user: NguoiDungBackend }>>('/auth/dang-nhap', data);
    console.log('Raw API response:', response);
    console.log('Response data:', response.data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post<ApiResponse<void>>('/auth/dang-ky', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<ApiResponse<NguoiDung>>('/auth/me');
    return response.data;
  },
};
