using BTL_CNW.DAL.DanhMuc;
using BTL_CNW.DTO.DanhMuc;

namespace BTL_CNW.BLL.DanhMuc
{
    public class DanhMucService
    {
        private readonly IDanhMucRepository _danhMucRepository;
        private readonly ILinhVucRepository _linhVucRepository;

        public DanhMucService(IDanhMucRepository danhMucRepository, ILinhVucRepository linhVucRepository)
        {
            _danhMucRepository = danhMucRepository;
            _linhVucRepository = linhVucRepository;
        }

        public async Task<List<DanhMucDto>> GetAllDanhMucAsync()
        {
            var danhMucs = await _danhMucRepository.GetAllAsync();
            var jobCounts = await _danhMucRepository.GetJobCountByDanhMucAsync();

            // Lấy danh mục cha (MaDanhMucCha == null)
            var danhMucCha = danhMucs.Where(d => d.MaDanhMucCha == null).ToList();

            var result = new List<DanhMucDto>();
            foreach (var dm in danhMucCha)
            {
                var dto = MapToDanhMucDto(dm, danhMucs, jobCounts);
                result.Add(dto);
            }

            return result.OrderByDescending(d => d.SoLuongTin).ToList();
        }

        public async Task<List<DanhMucDto>> GetDanhMucByParentAsync(int? parentId)
        {
            var danhMucs = await _danhMucRepository.GetByParentIdAsync(parentId);
            var jobCounts = await _danhMucRepository.GetJobCountByDanhMucAsync();

            return danhMucs.Select(dm => new DanhMucDto
            {
                MaDanhMuc = dm.MaDanhMuc,
                TenDanhMuc = dm.TenDanhMuc,
                MaDanhMucCha = dm.MaDanhMucCha,
                SoLuongTin = jobCounts.GetValueOrDefault(dm.MaDanhMuc, 0)
            }).ToList();
        }

        public async Task<List<LinhVucDto>> GetAllLinhVucAsync()
        {
            var linhVucs = await _linhVucRepository.GetAllAsync();
            return linhVucs.Select(lv => new LinhVucDto
            {
                MaLinhVuc = lv.MaLinhVuc,
                TenLinhVuc = lv.TenLinhVuc
            }).ToList();
        }

        private DanhMucDto MapToDanhMucDto(Models.DanhMucViecLam dm, List<Models.DanhMucViecLam> allDanhMucs, Dictionary<int, int> jobCounts)
        {
            var danhMucCon = allDanhMucs.Where(d => d.MaDanhMucCha == dm.MaDanhMuc).ToList();
            
            var dto = new DanhMucDto
            {
                MaDanhMuc = dm.MaDanhMuc,
                TenDanhMuc = dm.TenDanhMuc,
                MaDanhMucCha = dm.MaDanhMucCha,
                SoLuongTin = jobCounts.GetValueOrDefault(dm.MaDanhMuc, 0)
            };

            if (danhMucCon.Any())
            {
                dto.DanhMucCon = danhMucCon.Select(child => MapToDanhMucDto(child, allDanhMucs, jobCounts)).ToList();
            }

            return dto;
        }
    }
}
