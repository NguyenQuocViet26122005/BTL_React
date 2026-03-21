import api from './api';
import type { TinTuyenDung, ApiResponse } from '../types/index';

export const jobService = {
  getAllJobs: async () => {
    const response = await api.get<ApiResponse<TinTuyenDung[]>>('/tin-tuyen-dung');
    return response.data;
  },

  getJobById: async (id: number) => {
    const response = await api.get<ApiResponse<TinTuyenDung>>(`/tin-tuyen-dung/${id}`);
    return response.data;
  },

  getJobsByCompany: async (companyId: number) => {
    const response = await api.get<ApiResponse<TinTuyenDung[]>>(`/tin-tuyen-dung/cong-ty/${companyId}`);
    return response.data;
  },

  getMyJobs: async (userId: number) => {
    const response = await api.get<ApiResponse<TinTuyenDung[]>>(`/tin-tuyen-dung/cua-toi/${userId}`);
    return response.data;
  },

  createJob: async (data: Partial<TinTuyenDung>) => {
    const response = await api.post<ApiResponse<void>>('/tin-tuyen-dung', data);
    return response.data;
  },

  updateJob: async (id: number, data: Partial<TinTuyenDung>) => {
    const response = await api.put<ApiResponse<void>>(`/tin-tuyen-dung/${id}`, data);
    return response.data;
  },

  deleteJob: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/tin-tuyen-dung/${id}`);
    return response.data;
  },
};
