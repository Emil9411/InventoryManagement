using InventoryManagement.Server.Authorization.Models;
using InventoryManagement.Server.Model;
using System.IdentityModel.Tokens.Jwt;

namespace InventoryManagement.Server.Authorization.Services
{
    public interface IAuthService
    {
        Task<AuthResult> RegisterAsync(string email, string username, string password, string role);
        Task<AuthResult> LoginAsync(string email, string password);
        Task<AuthResult> ChangePasswordAsync(string email, string currentPassword, string newPassword);
        Task<AuthResult> DeleteUser(string email);
        Task<ICollection<AppUser>> AppUsers();
        JwtSecurityToken Verify(string token);
        Task<bool> VerifyEmail(string userId, string verificationCode);
    }
}
