import api from './api';
import type { ApiResponse, DonUngTuyen, TinTuyenDung } from '../types';

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
  },

  // Lấy đơn ứng tuyển theo tin tuyển dụng (cho nhà tuyển dụng)
  getApplicationsByJob: async (maTin: number) => {
    const response = await api.get<ApiResponse<DonUngTuyen[]>>(`/don-ung-tuyen/theo-tin/${maTin}`);
    return response.data;
  },

  // Lấy tất cả đơn ứng tuyển của công ty (sử dụng endpoint mới)
  getCompanyApplications: async (maCongTy: number) => {
    const response = await api.get<ApiResponse<DonUngTuyen[]>>(`/don-ung-tuyen/theo-cong-ty/${maCongTy}`);
    return response.data;
  },

  // Cập nhật trạng thái đơn ứng tuyển (cho nhà tuyển dụng)
  updateStatus: async (maDon: number, data: { trangThai: string }) => {
    const response = await api.put<ApiResponse<void>>(`/don-ung-tuyen/${maDon}/trang-thai`, data);
    return response.data;
  }
};