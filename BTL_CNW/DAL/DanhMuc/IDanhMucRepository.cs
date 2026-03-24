using BTL_CNW.Models;

namespace BTL_CNW.DAL.DanhMuc
{
    public interface IDanhMucRepository
    {
        Task<List<DanhMucViecLam>> GetAllAsync();
        Task<DanhMucViecLam?> GetByIdAsync(int id);
        Task<List<DanhMucViecLam>> GetByParentIdAsync(int? parentId);
        Task<Dictionary<int, int>> GetJobCountByDanhMucAsync();
    }

    public interface ILinhVucRepository
    {
        Task<List<LinhVuc>> GetAllAsync();
        Task<LinhVuc?> GetByIdAsync(int id);
    }
}
