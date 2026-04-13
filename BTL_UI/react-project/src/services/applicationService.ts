import api from './api';
import type { ApiResponse, DonUngTuyen } from '../types';

export const applicationService = {
  // Lấy danh sách đơn ứng tuyển của ứng viên
  getMyApplications: async (maUngVien: number) => {
    const response = await api.get<ApiResponse<DonUngTuyen[]>>(`/don-ung-tuyen/cua-toi/${maUngVien}`);
    return response.data;
  },

  // Nộp đơn ứng tuyển
  submitApplication: async (data: { maTin: number; maUngVien: number; maFileCV: number; thuGioiThieu?: string }) => {
    const response = await api.post<ApiResponse<void>>('/don-ung-tuyen', data);
    return response.data;
  },

  // Lấy chi tiết đơn ứng tuyển
  getApplicationDetail: async (maDon: number) => {
    const response = await api.get<ApiResponse<DonUngTuyen>>(`/don-ung-tuyen/${maDon}`);
    return response.data;
  }
};