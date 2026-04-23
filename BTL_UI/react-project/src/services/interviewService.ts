import api from './api';
import { ApiResponse } from '../types';

export interface LichPhongVan {
  maLich: number;
  maDon: number;
  maNguoiLich: number;
  tenNguoiLich?: string;
  vongPhongVan: number;
  hinhThuc: string;
  thoiGian: string;
  thoiLuongPhut?: number;
  diaDiem?: string;
  ghiChu?: string;
  trangThai: string;
  ngayTao?: string;
  ngayCapNhat?: string;
  // Thong tin don ung tuyen
  tenUngVien?: string;
  emailUngVien?: string;
  viTriUngTuyen?: string;
}

export interface TaoLichDto {
  maDon: number;
  maNguoiLich: number;
  vongPhongVan?: number;
  hinhThuc: string;
  thoiGian: string;
  thoiLuongPhut?: number;
  diaDiem?: string;
  ghiChu?: string;
}

export const interviewService = {
  // Tao lich phong van
  createInterview: async (data: TaoLichDto) => {
    const response = await api.post<ApiResponse<void>>('/lich-phong-van', data);
    return response.data;
  },

  // Lay danh sach lich theo don
  getByApplication: async (maDon: number) => {
    const response = await api.get<ApiResponse<LichPhongVan[]>>(`/lich-phong-van/theo-don/${maDon}`);
    return response.data;
  },

  // Lay chi tiet lich
  getDetail: async (maLich: number) => {
    const response = await api.get<ApiResponse<LichPhongVan>>(`/lich-phong-van/${maLich}`);
    return response.data;
  },

  // Doi trang thai lich
  updateStatus: async (maLich: number, trangThai: string) => {
    const response = await api.put<ApiResponse<void>>(`/lich-phong-van/${maLich}/trang-thai?trangThai=${trangThai}`);
    return response.data;
  }
};
