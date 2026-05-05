import api from './api';
import type { ApiResponse, AdminUserListResponse } from '../types';

export const getAdminUsers = async (params: {
  search?: string;
  status?: 'all' | 'active' | 'locked';
  page?: number;
  pageSize?: number;
}) => {
  const query = new URLSearchParams();

  if (params.search) query.append('search', params.search);
  if (params.status) query.append('status', params.status);
  if (params.page) query.append('page', params.page.toString());
  if (params.pageSize) query.append('pageSize', params.pageSize.toString());

  const response = await api.get<ApiResponse<AdminUserListResponse>>(`/admin/users?${query.toString()}`);
  return response.data;
};

export const lockAdminUser = async (maNguoiDung: number) => {
  const response = await api.patch<ApiResponse<void>>(`/admin/users/${maNguoiDung}/lock`);
  return response.data;
};

export const unlockAdminUser = async (maNguoiDung: number) => {
  const response = await api.patch<ApiResponse<void>>(`/admin/users/${maNguoiDung}/unlock`);
  return response.data;
};
