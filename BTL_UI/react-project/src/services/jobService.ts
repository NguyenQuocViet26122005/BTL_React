import api from './api';
import type { TinTuyenDung, ApiResponse } from '../types/index';

export const jobService = {
  getAllJobs: async () => {
    const response = await api.get<ApiResponse<TinTuyenDung[]>>('/tin-tuyen-dung');
    return response.data;
  },

  filterJobs: async (filters: {
    search?: string;
    danhMuc?: number[];
    kinhNghiem?: string;
    hinhThucLamViec?: string;
    linhVuc?: number[];
    mucLuongMin?: number;
    mucLuongMax?: number;
    thanhPho?: string;
  }) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.kinhNghiem && filters.kinhNghiem !== 'all') params.append('kinhNghiem', filters.kinhNghiem);
    if (filters.hinhThucLamViec && filters.hinhThucLamViec !== 'all') params.append('hinhThucLamViec', filters.hinhThucLamViec);
    if (filters.thanhPho) params.append('thanhPho', filters.thanhPho);
    if (filters.mucLuongMin) params.append('mucLuongMin', filters.mucLuongMin.toString());
    if (filters.mucLuongMax) params.append('mucLuongMax', filters.mucLuongMax.toString());
    
    if (filters.danhMuc && filters.danhMuc.length > 0) {
      filters.danhMuc.forEach(dm => params.append('danhMuc', dm.toString()));
    }
    
    if (filters.linhVuc && filters.linhVuc.length > 0) {
      filters.linhVuc.forEach(lv => params.append('linhVuc', lv.toString()));
    }

    const response = await api.get<ApiResponse<TinTuyenDung[]>>(`/tin-tuyen-dung/filter?${params.toString()}`);
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

// Export individual functions for convenience
export const getTinTuyenDungById = jobService.getJobById;
export const getAllJobs = jobService.getAllJobs;
export const filterJobs = jobService.filterJobs;

// Additional exports for CompanyDashboard
export const getTinTuyenDungByUser = jobService.getMyJobs;
export const createTinTuyenDung = jobService.createJob;
export const updateTinTuyenDung = jobService.updateJob;
export const deleteTinTuyenDung = jobService.deleteJob;

// Admin methods
export const getAllJobsForAdmin = async () => {
  const response = await api.get<ApiResponse<TinTuyenDung[]>>('/tin-tuyen-dung/admin/all');
  return response.data;
};

export const updateJobStatus = async (maTin: number, trangThai: string, lyDo?: string) => {
  const params = new URLSearchParams();
  params.append('trangThai', trangThai);
  if (lyDo) params.append('lyDo', lyDo);
  
  const response = await api.put<ApiResponse<void>>(`/tin-tuyen-dung/${maTin}/trang-thai?${params.toString()}`);
  return response.data;
};

// Add to jobService object
jobService.getAllJobsForAdmin = getAllJobsForAdmin;
jobService.updateJobStatus = updateJobStatus;
