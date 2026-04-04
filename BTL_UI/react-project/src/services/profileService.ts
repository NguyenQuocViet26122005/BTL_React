import api from './api';
import type { Profile, CapNhatProfile, DoiMatKhau, ApiResponse } from '../types';

export const profileService = {
  // Lấy thông tin profile nhà tuyển dụng
  getProfile: async (maNguoiDung: number) => {
    const response = await api.get<ApiResponse<Profile>>(`/profile/${maNguoiDung}`);
    return response.data;
  },

  // Cập nhật thông tin cá nhân
  updateProfile: async (maNguoiDung: number, data: CapNhatProfile) => {
    const response = await api.put<ApiResponse<void>>(`/profile/${maNguoiDung}`, data);
    return response.data;
  },

  // Đổi mật khẩu
  changePassword: async (maNguoiDung: number, data: DoiMatKhau) => {
    const response = await api.post<ApiResponse<void>>(`/profile/${maNguoiDung}/doi-mat-khau`, data);
    return response.data;
  },
};
