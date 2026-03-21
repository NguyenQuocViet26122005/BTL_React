import api from './api';
import type { LoginRequest, RegisterRequest, NguoiDung, ApiResponse } from '../types/index';

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await api.post<ApiResponse<{ token: string; user: NguoiDung }>>('/auth/dang-nhap', data);
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
