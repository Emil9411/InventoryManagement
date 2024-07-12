using System.ComponentModel.DataAnnotations;

namespace InventoryManagement.Server.Authorization.Requests
{
    public record ChangePasswordRequest([Required] string Email,
                                      [Required] string OldPassword,
                                      [Required] string NewPassword);
}
