// Types cho toàn bộ ứng dụng

export type NguoiDung = {
  maNguoiDung: number;
  tenDangNhap?: string;
  email: string;
  hoTen: string;
  maVaiTro: number;
  tenVaiTro?: string;
  soDienThoai?: string;
  ngayTao?: string;
};

export type LoginRequest = {
  email: string;
  matKhau: string;
};

// Backend response types (PascalCase from C#)
export type NguoiDungBackend = {
  MaNguoiDung: number;
  Email: string;
  HoTen: string;
  MaVaiTro: number;
  TenVaiTro?: string;
  SoDienThoai?: string;
  NgayTao?: string;
  DangHoatDong?: boolean;
  AnhDaiDien?: string;
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
  hinhThucLamViec?: string;
  kinhNghiem?: string;
  mucLuong?: number;
  mucLuongToiThieu?: number;
  mucLuongToiDa?: number;
  diaDiem: string;
  thanhPho: string;
  hanNopHoSo: string;
  soLuongTuyen?: number;
  luotXem?: number;
  trangThai: string;
  ngayDang?: string;
  ngayTao?: string;
};

export type CongTy = {
  maCongTy: number;
  tenCongTy: string;
  email?: string;
  soDienThoai?: string;
  maSoThue?: string;
  logo?: string;
  website?: string;
  maLinhVuc?: number;
  quyMo?: string;
  diaChi?: string;
  thanhPho?: string;
  quocGia?: string;
  moTa?: string;
  daDuocDuyet?: boolean;
  trangThai?: string;
  ngayTao?: string;
  ngayCapNhat?: string;
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
  emailUngVien?: string;
  maFileCV?: number;
  tenFileCV?: string;
  duongDanFileCV?: string;
  trangThai: string;
  ngayNop: string;
  ngayCapNhat?: string;
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

// Dashboard types
export type DashboardStats = {
  tongTinDang: number;
  tinDangTuyen: number;
  tinDaDong: number;
  tinChoXetDuyet: number;
  tongDonUngTuyen: number;
  donMoi: number;
  donDangXem: number;
  donVaoDanhSach: number;
  tongLuotXem: number;
  lichPhongVanHomNay: number;
  lichPhongVanTuanNay: number;
};

export type LichPhongVanSapToi = {
  maLich: number;
  maDon: number;
  tenUngVien: string;
  emailUngVien: string;
  viTriUngTuyen: string;
  vongPhongVan: number;
  hinhThuc: string;
  thoiGian: string;
  thoiLuongPhut: number;
  diaDiem?: string;
  trangThai: string;
};

export type BieuDoLuotXem = {
  ngay: string;
  luotXem: number;
};

export type BieuDoDonUngTuyen = {
  thang: string;
  soDon: number;
};

// Profile types
export type Profile = {
  maNguoiDung: number;
  hoTen: string;
  email: string;
  soDienThoai?: string;
  anhDaiDien?: string;
  dangHoatDong: boolean;
  ngayTao: string;
  maCongTy?: number;
  tenCongTy?: string;
  maSoThue?: string;
  logo?: string;
  website?: string;
  maLinhVuc?: number;
  tenLinhVuc?: string;
  quyMo?: string;
  diaChi?: string;
  thanhPho?: string;
  quocGia?: string;
  moTa?: string;
  daDuocDuyet?: boolean;
  trangThaiCongTy?: string;
};

export type CapNhatProfile = {
  hoTen: string;
  soDienThoai?: string;
  anhDaiDien?: string;
};

export type DoiMatKhau = {
  matKhauCu: string;
  matKhauMoi: string;
  xacNhanMatKhau: string;
};

export type FileCv = {
  maFileCv: number;
  maHoSo: number;
  tenFile: string;
  duongDanFile: string;
  kichThuoc?: number;
  loaiFile?: string;
  laMacDinh: boolean;
  ngayTai: string;
};
