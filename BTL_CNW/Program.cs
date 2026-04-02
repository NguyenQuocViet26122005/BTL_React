using BTL_CNW.BLL.Auth;
using BTL_CNW.BLL.CongTy;
using BTL_CNW.BLL.TinTuyenDung;
using BTL_CNW.BLL.DonUngTuyen;
using BTL_CNW.BLL.HoSoUngVien;
using BTL_CNW.BLL.LichPhongVan;
using BTL_CNW.BLL.DanhMuc;
using BTL_CNW.BLL.Dashboard;
using BTL_CNW.BLL.Profile;

using BTL_CNW.DAL.Auth;
using BTL_CNW.DAL.CongTy;
using BTL_CNW.DAL.TinTuyenDung;
using BTL_CNW.DAL.DonUngTuyen;
using BTL_CNW.DAL.HoSoUngVien;
using BTL_CNW.DAL.LichPhongVan;
using BTL_CNW.DAL.DanhMuc;
using BTL_CNW.DAL.Dashboard;
using BTL_CNW.DAL.Profile;

using BTL_CNW.Models;
using BTL_CNW.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

// ===== JWT AUTHENTICATION =====
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!)),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

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

// JWT Service
builder.Services.AddScoped<IJwtService, JwtService>();

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

// Danh mục và Lĩnh vực
builder.Services.AddScoped<IDanhMucRepository, DanhMucRepository>();
builder.Services.AddScoped<ILinhVucRepository, LinhVucRepository>();
builder.Services.AddScoped<DanhMucService>();

// Dashboard
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// Profile
builder.Services.AddScoped<IProfileRepository, ProfileRepository>();
builder.Services.AddScoped<IProfileService, ProfileService>();

var app = builder.Build();

// =====================
// HTTP PIPELINE
// =====================
// Bật Swagger cho mọi môi trường để dễ test
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "BTL_CNW API V1");
    c.RoutePrefix = "swagger"; // Truy cập tại http://localhost:5000/swagger
});

app.UseHttpsRedirection();

// CORS phải trước Authentication
app.UseCors("AllowAll");

// Authentication phải trước Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
