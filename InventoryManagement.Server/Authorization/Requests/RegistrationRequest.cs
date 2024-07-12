using System.ComponentModel.DataAnnotations;

namespace InventoryManagement.Server.Authorization.Requests
{
    public record RegistrationRequest([Required] string Email,
                                      [Required] string Username,
                                      [Required] string Password);
}
