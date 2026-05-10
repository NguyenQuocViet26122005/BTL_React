import api from './api';

export interface HocVan {
  maHocVan: number;
  maHoSo: number;
  truongHoc: string;
  bangCap?: string;
  chuyenNganh?: string;
  diemTrungBinh?: number;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  dangHocKhong?: boolean;
}

export interface TaoHocVanDto {
  maHoSo: number;
  truongHoc: string;
  bangCap?: string;
  chuyenNganh?: string;
  diemTrungBinh?: number;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  dangHocKhong?: boolean;
}

export const educationService = {
  getByHoSo: async (maHoSo: number) => {
    const response = await api.get(`/hoc-van/ho-so/${maHoSo}`);
    return response.data;
  },

  getByMa: async (maHocVan: number) => {
    const response = await api.get(`/hoc-van/${maHocVan}`);
    return response.data;
  },

  create: async (data: TaoHocVanDto) => {
    const response = await api.post('/hoc-van', data);
    return response.data;
  },

  update: async (maHocVan: number, data: TaoHocVanDto) => {
    const response = await api.put(`/hoc-van/${maHocVan}`, data);
    return response.data;
  },

  delete: async (maHocVan: number) => {
    const response = await api.delete(`/hoc-van/${maHocVan}`);
    return response.data;
  }
};
