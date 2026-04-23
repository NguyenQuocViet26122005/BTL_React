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

  // Lấy tất cả đơn ứng tuyển của công ty (qua các tin tuyển dụng)
  getCompanyApplications: async (maNguoiDung: number) => {
    // Lay tat ca tin tuyen dung cua nha tuyen dung
    const jobsResponse = await api.get<ApiResponse<TinTuyenDung[]>>(`/tin-tuyen-dung/cua-toi/${maNguoiDung}`);
    if (!jobsResponse.data.success || !jobsResponse.data.data) {
      return { success: false, message: 'Khong lay duoc tin tuyen dung', data: [] };
    }

    // Lay don ung tuyen cho tung tin
    const allApplications: DonUngTuyen[] = [];
    for (const job of jobsResponse.data.data) {
      const appResponse = await api.get<ApiResponse<DonUngTuyen[]>>(`/don-ung-tuyen/theo-tin/${job.maTin}`);
      if (appResponse.data.success && appResponse.data.data) {
        allApplications.push(...appResponse.data.data);
      }
    }

    return { success: true, message: 'Thanh cong', data: allApplications };
  }
};