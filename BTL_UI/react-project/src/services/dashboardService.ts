import api from './api';
import type { ApiResponse, DashboardStats, LichPhongVanSapToi, BieuDoLuotXem, BieuDoDonUngTuyen } from '../types';

export const getDashboardStats = async (maNguoiDung: number): Promise<ApiResponse<DashboardStats>> => {
  const response = await api.get(`/dashboard/thong-ke/${maNguoiDung}`);
  return response.data;
};

export const getLichPhongVanSapToi = async (
  maNguoiDung: number,
  soNgay: number = 7
): Promise<ApiResponse<LichPhongVanSapToi[]>> => {
  const response = await api.get(`/dashboard/lich-phong-van-sap-toi/${maNguoiDung}`, {
    params: { soNgay }
  });
  return response.data;
};

export const getBieuDoLuotXem = async (
  maNguoiDung: number,
  soNgay: number = 7
): Promise<ApiResponse<BieuDoLuotXem[]>> => {
  const response = await api.get(`/dashboard/bieu-do-luot-xem/${maNguoiDung}`, {
    params: { soNgay }
  });
  return response.data;
};

export const getBieuDoDonUngTuyen = async (
  maNguoiDung: number,
  soThang: number = 6
): Promise<ApiResponse<BieuDoDonUngTuyen[]>> => {
  const response = await api.get(`/dashboard/bieu-do-don-ung-tuyen/${maNguoiDung}`, {
    params: { soThang }
  });
  return response.data;
};
