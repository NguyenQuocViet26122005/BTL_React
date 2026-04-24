import api from './api';
import type { ApiResponse } from '../types/index';

export type ThongBao = {
  maThongBao: number;
  maNguoiDung: number;
  loaiThongBao: string;
  tieuDe: string;
  noiDung?: string;
  loaiLienKet?: string;
  maLienKet?: number;
  daDoc: boolean;
  ngayTao: string;
};

export const notificationService = {
  getNotifications: async (maNguoiDung: number, pageSize: number = 20, pageNumber: number = 1) => {
    const response = await api.get<ApiResponse<ThongBao[]>>(
      `/thong-bao/cua-toi/${maNguoiDung}?pageSize=${pageSize}&pageNumber=${pageNumber}`
    );
    return response.data;
  },

  getUnreadCount: async (maNguoiDung: number) => {
    const response = await api.get<ApiResponse<{ count: number }>>(
      `/thong-bao/chua-doc/${maNguoiDung}`
    );
    return response.data;
  },

  markAsRead: async (maThongBao: number) => {
    const response = await api.put<ApiResponse<void>>(
      `/thong-bao/${maThongBao}/da-doc`
    );
    return response.data;
  },

  markAllAsRead: async (maNguoiDung: number) => {
    const response = await api.put<ApiResponse<void>>(
      `/thong-bao/tat-ca-da-doc/${maNguoiDung}`
    );
    return response.data;
  }
};

export default notificationService;
