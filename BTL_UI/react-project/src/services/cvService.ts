import api from './api';
import type { ApiResponse } from '../types/index';

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

export const cvService = {
  uploadCv: async (maHoSo: number, file: File, laMacDinh: boolean = false) => {
    const formData = new FormData();
    formData.append('MaHoSo', maHoSo.toString());
    formData.append('File', file);
    formData.append('LaMacDinh', laMacDinh.toString());

    const response = await api.post<ApiResponse<FileCv>>('/file-cv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getCvByHoSo: async (maHoSo: number) => {
    const response = await api.get<ApiResponse<FileCv[]>>(`/file-cv/ho-so/${maHoSo}`);
    return response.data;
  },

  getCvDetail: async (maFileCv: number) => {
    const response = await api.get<ApiResponse<FileCv>>(`/file-cv/${maFileCv}`);
    return response.data;
  },

  setDefaultCv: async (maFileCv: number, maHoSo: number) => {
    const response = await api.put<ApiResponse<void>>(`/file-cv/${maFileCv}/mac-dinh?maHoSo=${maHoSo}`);
    return response.data;
  },

  deleteCv: async (maFileCv: number) => {
    const response = await api.delete<ApiResponse<void>>(`/file-cv/${maFileCv}`);
    return response.data;
  }
};

export default cvService;
