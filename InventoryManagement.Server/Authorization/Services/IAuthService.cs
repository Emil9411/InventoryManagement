using InventoryManagement.Server.Authorization.Models;
using System.IdentityModel.Tokens.Jwt;

namespace InventoryManagement.Server.Authorization.Services
{
    public interface IAuthService
    {
        Task<AuthResult> RegisterAsync(string email, string username, string password, string role);
        Task<AuthResult> LoginAsync(string email, string password);
        Task<AuthResult> ChangePasswordAsync(string email, string currentPassword, string newPassword);
        Task<AuthResult> ChangeEmailAsync(string email, string newEmail);
        JwtSecurityToken Verify(string token);
    }
}
