import api from './api';
import type { ApiResponse } from '../types';

export type SavedJobItem = {
  maTin: number;
  ngayLuu: string;
  tieuDe: string;
  thanhPho?: string;
  mucLuongToiThieu?: number;
  mucLuongToiDa?: number;
  donViTien?: string;
  tenCongTy: string;
  logoCongTy?: string;
};

export const savedJobService = {
  getMySavedJobs: async () => {
    const response = await api.get<ApiResponse<SavedJobItem[]>>('/tin-da-luu/cua-toi');
    return response.data;
  },

  saveJob: async (maTin: number) => {
    const response = await api.post<ApiResponse<void>>(`/tin-da-luu/${maTin}`);
    return response.data;
  },

  unsaveJob: async (maTin: number) => {
    const response = await api.delete<ApiResponse<void>>(`/tin-da-luu/${maTin}`);
    return response.data;
  },
};

export default savedJobService;

