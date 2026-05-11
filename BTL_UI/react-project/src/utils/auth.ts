import type { NguoiDung } from '../types';

export const ROLE_ADMIN = 1;
export const ROLE_COMPANY = 2;
export const ROLE_CANDIDATE = 3;

export type StoredUser = NguoiDung & {
  maCongTy?: number;
  MaNguoiDung?: number;
  Email?: string;
  HoTen?: string;
  MaVaiTro?: number;
  TenVaiTro?: string;
  SoDienThoai?: string;
};

export const normalizeUser = (rawUser: any): StoredUser | null => {
  if (!rawUser) return null;

  const maNguoiDung = rawUser.maNguoiDung ?? rawUser.MaNguoiDung;
  const email = rawUser.email ?? rawUser.Email;
  const hoTen = rawUser.hoTen ?? rawUser.HoTen;
  const maVaiTro = rawUser.maVaiTro ?? rawUser.MaVaiTro;

  if (!maNguoiDung || !email || !hoTen || !maVaiTro) return null;

  return {
    ...rawUser,
    maNguoiDung,
    email,
    hoTen,
    maVaiTro,
    tenVaiTro: rawUser.tenVaiTro ?? rawUser.TenVaiTro,
    soDienThoai: rawUser.soDienThoai ?? rawUser.SoDienThoai,
  };
};

export const getStoredUser = (): StoredUser | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return normalizeUser(JSON.parse(userStr));
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

export const getStoredRole = () => getStoredUser()?.maVaiTro;

export const getDefaultRouteForRole = (role?: number) => {
  if (role === ROLE_ADMIN) return '/admin/jobs';
  if (role === ROLE_COMPANY) return '/company/dashboard';
  if (role === ROLE_CANDIDATE) return '/';
  return '/login';
};

export const isAuthenticated = () => Boolean(localStorage.getItem('token') && getStoredUser());
