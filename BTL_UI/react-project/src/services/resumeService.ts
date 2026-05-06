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
  },

  // Tim kiem ho so ung vien (cho nha tuyen dung)
  searchResumes: async (filters: {
    tuKhoa?: string;
    thanhPho?: string;
    tinhTrang?: string;
    mucLuongTu?: number;
    mucLuongDen?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters.tuKhoa) params.append('tuKhoa', filters.tuKhoa);
    if (filters.thanhPho) params.append('thanhPho', filters.thanhPho);
    if (filters.tinhTrang) params.append('tinhTrang', filters.tinhTrang);
    if (filters.mucLuongTu) params.append('mucLuongTu', filters.mucLuongTu.toString());
    if (filters.mucLuongDen) params.append('mucLuongDen', filters.mucLuongDen.toString());

    const response = await api.get<ApiResponse<HoSoUngVien[]>>(`/ho-so/tim-kiem?${params.toString()}`);
    return response.data;
  },

  // Lay danh sach ho so (cho nha tuyen dung)
  getResumeList: async (skip: number = 0, take: number = 20) => {
    const response = await api.get<ApiResponse<HoSoUngVien[]>>(`/ho-so/danh-sach?skip=${skip}&take=${take}`);
    return response.data;
  }
};
