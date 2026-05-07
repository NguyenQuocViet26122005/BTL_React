import api from './api';

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
    const response = await api.get(`/thu-moi/${maThuMoi}`);
    return response.data;
  },

  getByUngVien: async (maUngVien: number) => {
    const response = await api.get(`/thu-moi/ung-vien/${maUngVien}`);
    return response.data;
  },

  getByCongTy: async (maCongTy: number) => {
    const response = await api.get(`/thu-moi/cong-ty/${maCongTy}`);
    return response.data;
  },

  getByNguoiPhatHanh: async (maNguoiPhatHanh: number) => {
    const response = await api.get(`/thu-moi/nguoi-phat-hanh/${maNguoiPhatHanh}`);
    return response.data;
  },

  create: async (data: TaoThuMoiDto) => {
    const response = await api.post('/thu-moi', data);
    return response.data;
  },

  respond: async (maThuMoi: number, data: PhanHoiThuMoiDto) => {
    const response = await api.put(`/thu-moi/${maThuMoi}/phan-hoi`, data);
    return response.data;
  },

  delete: async (maThuMoi: number) => {
    const response = await api.delete(`/thu-moi/${maThuMoi}`);
    return response.data;
  }
};