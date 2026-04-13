import api from './api';
import type { ApiResponse, HoSoUngVien } from '../types';

export const resumeService = {
  // Lay ho so cua toi
  getMyResume: async (maNguoiDung: number) => {
    const response = await api.get<ApiResponse<HoSoUngVien>>(`/ho-so/cua-toi/${maNguoiDung}`);
    return response.data;
  },

  // Tao ho so moi
  createResume: async (data: Partial<HoSoUngVien>) => {
    const response = await api.post<ApiResponse<void>>('/ho-so', data);
    return response.data;
  },

  // Cap nhat ho so
  updateResume: async (maHoSo: number, data: Partial<HoSoUngVien>) => {
    const response = await api.put<ApiResponse<void>>(`/ho-so/${maHoSo}`, data);
    return response.data;
  },

  // Lay ho so theo ID
  getResumeById: async (maHoSo: number) => {
    const response = await api.get<ApiResponse<HoSoUngVien>>(`/ho-so/${maHoSo}`);
    return response.data;
  }
};
