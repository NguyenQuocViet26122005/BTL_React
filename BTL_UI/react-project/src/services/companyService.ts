import api from './api';
import type { CongTy, ApiResponse } from '../types';

export interface TaoCongTyDto {
  maChuSoHuu: number;
  tenCongTy: string;
  maSoThue?: string;
  website?: string;
  maLinhVuc?: number;
  quyMo?: string;
  diaChi?: string;
  thanhPho?: string;
  moTa?: string;
}

export interface CapNhatCongTyDto {
  tenCongTy?: string;
  logo?: string;
  website?: string;
  maLinhVuc?: number;
  quyMo?: string;
  diaChi?: string;
  thanhPho?: string;
  moTa?: string;
}

export const companyService = {
  // Lấy công ty của nhà tuyển dụng
  getMyCompany: async (maNguoiDung: number) => {
    const response = await api.get<ApiResponse<CongTy>>(`/cong-ty/cua-toi/${maNguoiDung}`);
    return response.data;
  },

  // Lấy công ty theo email
  getCompanyByEmail: async (email: string) => {
    const response = await api.get<ApiResponse<CongTy>>(`/cong-ty/theo-email/${email}`);
    return response.data;
  },

  // Tạo công ty mới
  createCompany: async (data: TaoCongTyDto) => {
    const response = await api.post<ApiResponse<void>>('/cong-ty', data);
    return response.data;
  },

  // Cập nhật thông tin công ty
  updateCompany: async (maCongTy: number, data: CapNhatCongTyDto) => {
    const response = await api.put<ApiResponse<void>>(`/cong-ty/${maCongTy}`, data);
    return response.data;
  },

  // Lấy công ty theo ID
  getCompanyById: async (maCongTy: number) => {
    const response = await api.get<ApiResponse<CongTy>>(`/cong-ty/${maCongTy}`);
    return response.data;
  },
};
