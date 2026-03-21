// Types cho toàn bộ ứng dụng

export type NguoiDung = {
  maNguoiDung: number;
  tenDangNhap: string;
  email: string;
  hoTen: string;
  maVaiTro: number;
  tenVaiTro?: string;
  soDienThoai?: string;
  ngayTao?: string;
};

export type LoginRequest = {
  tenDangNhap: string;
  matKhau: string;
};

export type RegisterRequest = {
  tenDangNhap: string;
  matKhau: string;
  email: string;
  hoTen: string;
  maVaiTro: number;
  soDienThoai?: string;
};

export type TinTuyenDung = {
  maTin: number;
  maCongTy: number;
  tenCongTy?: string;
  tieuDe: string;
  moTa: string;
  yeuCau: string;
  quyenLoi: string;
  mucLuong?: number;
  mucLuongToiThieu?: number;
  mucLuongToiDa?: number;
  diaDiem: string;
  thanhPho: string;
  hanNopHoSo: string;
  trangThai: string;
  ngayDang?: string;
};

export type CongTy = {
  maCongTy: number;
  tenCongTy: string;
  email: string;
  soDienThoai?: string;
  website?: string;
  quyMo?: string;
  diaChi?: string;
  thanhPho?: string;
  moTa?: string;
  trangThai?: string;
};

export type HoSoUngVien = {
  maHoSo: number;
  maNguoiDung: number;
  hoTen: string;
  email: string;
  soDienThoai: string;
  tieuDe: string;
  tomTat: string;
  ngaySinh?: string;
  gioiTinh?: string;
  diaChi?: string;
  thanhPho?: string;
  linkedIn?: string;
  gitHub?: string;
  portfolio?: string;
  tinhTrangTimViec?: string;
  mucLuongMongMuon?: number;
};

export type DonUngTuyen = {
  maDon: number;
  maTin: number;
  tieuDeTin?: string;
  maUngVien: number;
  tenUngVien?: string;
  trangThai: string;
  ngayNop: string;
  thuGioiThieu?: string;
};

export type LichPhongVan = {
  maLich: number;
  maDon: number;
  vongPhongVan: number;
  hinhThuc: string;
  thoiGian: string;
  thoiLuongPhut: number;
  diaDiem?: string;
  ghiChu?: string;
  trangThai: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
