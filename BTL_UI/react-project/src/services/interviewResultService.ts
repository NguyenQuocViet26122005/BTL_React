import api from './api';

export interface KetQuaPhongVan {
  maKetQua: number;
  maLich: number;
  maNguoiDanhGia: number;
  tenNguoiDanhGia?: string;
  diemTongQuat?: number;
  diemKyThuat?: number;
  diemKyNangMem?: number;
  ketQua: string;
  nhanXet?: string;
  ngayTao: string;
  viTriUngTuyen?: string;
  thoiGianPhongVan?: string;
}

export interface TaoKetQuaDto {
  maLich: number;
  diemTongQuat?: number;
  diemKyThuat?: number;
  diemKyNangMem?: number;
  ketQua: string;
  nhanXet?: string;
}

export const interviewResultService = {
  getByMa: async (maKetQua: number) => {
    const response = await api.get(`/ket-qua-phong-van/${maKetQua}`);
    return response.data;
  },

  getByLich: async (maLich: number) => {
    const response = await api.get(`/ket-qua-phong-van/lich/${maLich}`);
    return response.data;
  },

  getByUngVien: async (maUngVien: number) => {
    const response = await api.get(`/ket-qua-phong-van/ung-vien/${maUngVien}`);
    return response.data;
  },

  create: async (data: TaoKetQuaDto) => {
    const response = await api.post('/ket-qua-phong-van', data);
    return response.data;
  },

  update: async (maKetQua: number, data: TaoKetQuaDto) => {
    const response = await api.put(`/ket-qua-phong-van/${maKetQua}`, data);
    return response.data;
  },

  delete: async (maKetQua: number) => {
    const response = await api.delete(`/ket-qua-phong-van/${maKetQua}`);
    return response.data;
  }
};