import axios from 'axios';

const API_URL = 'https://localhost:44314/api';

export interface ThuMoiLamViec {
  maThuMoi: number;
  maDon: number;
  maNguoiPhatHanh: number;
  tenNguoiPhatHanh?: string;
  viTriCongViec: string;
  mucLuong: number;
  donViTien?: string;
  ngayBatDauDuKien?: string;
  ngayHetHan?: string;
  fileThuMoi?: string;
  trangThai: string;
  ngayPhanHoi?: string;
  ghiChu?: string;
  ngayTao: string;
  ngayCapNhat: string;
  tenUngVien?: string;
  tenCongTy?: string;
}

export interface TaoThuMoiDto {
  maDon: number;
  viTriCongViec: string;
  mucLuong: number;
  donViTien?: string;
  ngayBatDauDuKien?: string;
  ngayHetHan?: string;
  ghiChu?: string;
}

export interface PhanHoiThuMoiDto {
  trangThai: string;
  ghiChu?: string;
}

export const offerService = {
  getByMa: async (maThuMoi: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/thu-moi/${maThuMoi}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getByUngVien: async (maUngVien: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/thu-moi/ung-vien/${maUngVien}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getByCongTy: async (maCongTy: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/thu-moi/cong-ty/${maCongTy}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  create: async (data: TaoThuMoiDto) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/thu-moi`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  respond: async (maThuMoi: number, data: PhanHoiThuMoiDto) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/thu-moi/${maThuMoi}/phan-hoi`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  delete: async (maThuMoi: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/thu-moi/${maThuMoi}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};