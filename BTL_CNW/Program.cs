using BTL_CNW.BLL.Auth;
using BTL_CNW.BLL.CongTy;
using BTL_CNW.BLL.TinTuyenDung;
using BTL_CNW.BLL.DonUngTuyen;
using BTL_CNW.BLL.HoSoUngVien;
using BTL_CNW.BLL.LichPhongVan;

using BTL_CNW.DAL.Auth;
using BTL_CNW.DAL.CongTy;
using BTL_CNW.DAL.TinTuyenDung;
using BTL_CNW.DAL.DonUngTuyen;
using BTL_CNW.DAL.HoSoUngVien;
using BTL_CNW.DAL.LichPhongVan;

using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// =====================
// ADD SERVICES
// =====================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ===== ENTITY FRAMEWORK =====
builder.Services.AddDbContext<QuanLyViecLamContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ===== CORS =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ===== DEPENDENCY INJECTION =====

// Auth
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Công ty
builder.Services.AddScoped<ICongTyRepository, CongTyRepository>();
builder.Services.AddScoped<ICongTyService, CongTyService>();

// Tin tuyển dụng
builder.Services.AddScoped<ITinTuyenDungRepository, TinTuyenDungRepository>();
builder.Services.AddScoped<ITinTuyenDungService, TinTuyenDungService>();

// Đơn ứng tuyển
builder.Services.AddScoped<IDonUngTuyenRepository, DonUngTuyenRepository>();
builder.Services.AddScoped<IDonUngTuyenService, DonUngTuyenService>();

// Hồ sơ ứng viên
builder.Services.AddScoped<IHoSoUngVienRepository, HoSoUngVienRepository>();
builder.Services.AddScoped<IHoSoUngVienService, HoSoUngVienService>();

// Lịch phỏng vấn
builder.Services.AddScoped<ILichPhongVanRepository, LichPhongVanRepository>();
builder.Services.AddScoped<ILichPhongVanService, LichPhongVanService>();

var app = builder.Build();

// =====================
// HTTP PIPELINE
// =====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS phải trước Authorization
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
