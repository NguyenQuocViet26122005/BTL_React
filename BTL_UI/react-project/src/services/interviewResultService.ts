import axios from 'axios';

const API_URL = 'https://localhost:44314/api';

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
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/ket-qua-phong-van/${maKetQua}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getByLich: async (maLich: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/ket-qua-phong-van/lich/${maLich}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getByUngVien: async (maUngVien: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/ket-qua-phong-van/ung-vien/${maUngVien}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  create: async (data: TaoKetQuaDto) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/ket-qua-phong-van`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  update: async (maKetQua: number, data: TaoKetQuaDto) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/ket-qua-phong-van/${maKetQua}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  delete: async (maKetQua: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/ket-qua-phong-van/${maKetQua}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};