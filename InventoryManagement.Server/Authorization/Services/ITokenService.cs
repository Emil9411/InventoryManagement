using InventoryManagement.Server.Model;

namespace InventoryManagement.Server.Authorization.Services
{
    public interface ITokenService
    {
        string CreateToken(AppUser user, string role);
    }
}
