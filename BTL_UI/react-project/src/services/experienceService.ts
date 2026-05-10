import api from './api';

export interface KinhNghiem {
  maKinhNghiem: number;
  maHoSo: number;
  tenCongTy: string;
  viTri: string;
  moTa?: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  dangLamKhong?: boolean;
}

export interface TaoKinhNghiemDto {
  maHoSo: number;
  tenCongTy: string;
  viTri: string;
  moTa?: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  dangLamKhong?: boolean;
}

export const experienceService = {
  getByHoSo: async (maHoSo: number) => {
    const response = await api.get(`/kinh-nghiem/ho-so/${maHoSo}`);
    return response.data;
  },

  getByMa: async (maKinhNghiem: number) => {
    const response = await api.get(`/kinh-nghiem/${maKinhNghiem}`);
    return response.data;
  },

  create: async (data: TaoKinhNghiemDto) => {
    const response = await api.post('/kinh-nghiem', data);
    return response.data;
  },

  update: async (maKinhNghiem: number, data: TaoKinhNghiemDto) => {
    const response = await api.put(`/kinh-nghiem/${maKinhNghiem}`, data);
    return response.data;
  },

  delete: async (maKinhNghiem: number) => {
    const response = await api.delete(`/kinh-nghiem/${maKinhNghiem}`);
    return response.data;
  }
};
