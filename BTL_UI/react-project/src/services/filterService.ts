import api from './api';

export interface DanhMucDto {
  maDanhMuc: number;
  tenDanhMuc: string;
  maDanhMucCha: number | null;
  soLuongTin: number;
  danhMucCon?: DanhMucDto[];
}

export interface LinhVucDto {
  maLinhVuc: number;
  tenLinhVuc: string;
}

const filterService = {
  // Lấy tất cả danh mục
  getAllDanhMuc: async (): Promise<DanhMucDto[]> => {
    const response = await api.get('/danhmuc');
    return response.data;
  },

  // Lấy danh mục theo parent
  getDanhMucByParent: async (parentId: number | null): Promise<DanhMucDto[]> => {
    const response = await api.get(`/danhmuc/parent/${parentId}`);
    return response.data;
  },

  // Lấy tất cả lĩnh vực
  getAllLinhVuc: async (): Promise<LinhVucDto[]> => {
    const response = await api.get('/danhmuc/linhvuc');
    return response.data;
  }
};

export default filterService;
